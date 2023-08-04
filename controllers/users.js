const cwr = require("../utils/createWebResp");
const userService = require("../services/users");
const transactionService = require("../services/user/transaction");
const authService = require("../services/auths");
const didService = require("../services/user/did");
const crypt = require("../utils/crypt");
const utilsDid = require("../utils/did/keys");
const utilsIpfs = require("../utils/ipfs/ipfs");

// 회원가입
const postRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      passwordConfirm,
      agreeService,
      agreePrivacy,
    } = req.body;

    // 비밀번호 일치 체크
    if (password !== passwordConfirm) {
      return cwr.errorWebResp(
        res,
        403,
        `E0000 - 비밀번호가 일치하지 않습니다.`
      );
    }

    const salt = Math.round(new Date().valueOf() * Math.random()).toString();
    const hashed = await crypt.toSha512Hash(password, salt);

    const hasEmail = await userService.findByEmail(email);

    if (hasEmail) {
      return cwr.errorWebResp(res, 403, `E0000 - 이미가입된 이메일입니다.`);
    }

    const { publicKey, privateKey } = utilsDid.generateRsaKeyPair("qwerty");
    // userId를 주소로 ipfs 노드에 공개키 저장

    const result = await utilsIpfs.addFile("publicKey", publicKey);

    // 최초 포인트 지급(회원가입 포인트)
    const point = 5000;
    const usersForm = {
      name,
      displayName: name,
      email,
      status: "active",
      photoURL:
        "https://salti.s3.ap-northeast-2.amazonaws.com/common/1639463975954_default_canda.png",
      authorized: true,
      password: hashed,
      salt,
      agreeService,
      agreePrivacy,
      role: "user",
      publicKey,
      privateKey,
      ipid: `did:ipid:${result.hash}`,
      ipidHash: result.hash,
    };
    const userDoc = await userService.create(usersForm);

    // 인증내역 생성 및 포인트 지급
    const authTransactionForm = {
      userId: userDoc._id,
      memo: "회원가입 및 축하포인트 지급",
      type: "TBD", // 형태
      usedFor: "회원가입 축하금", // 데이터 사용처
      point,
    };
    const authTransactionFormResult = await utilsIpfs.addFile(
      "authTransactionForm",
      authTransactionForm
    );
    await didService.createTransaction({
      ...authTransactionForm,
      ipfsTxId: authTransactionFormResult.hash,
    });
    await userService.updatePoint(userDoc._id, point);

    const jwtSource = {
      id: userDoc._id,
      email: userDoc.email,
      displayName: userDoc.displayName,
      photoURL: userDoc.photoURL,
      role: userDoc.role,
    };
    const jwt = await authService.makeUserJWT(jwtSource);
    return cwr.createWebResp(res, 200, jwt);
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - postRegister`, error.message);
  }
};

// 계정정보 로그인, jwt 발급
const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await userService.findByEmail(email);
    if (!userDoc) {
      return cwr.errorWebResp(res, 403, "E1015 - 존재하지 않는 사용자입니다.");
    }
    if (userDoc?.role !== "user") {
      return cwr.errorWebResp(res, 403, `E0000 - 사용자 계정이 아닙니다.`);
    }
    const hashed = await crypt.toSha512Hash(password, userDoc.salt);
    if (hashed !== userDoc.password) {
      return cwr.errorWebResp(
        res,
        403,
        "E1019 - 로그인 실패 (이메일 또는 패스워드 불일치)"
      );
    }
    const jwtSource = {
      id: userDoc._id,
      email: userDoc.email,
      displayName: userDoc.displayName,
      photoURL: userDoc.photoURL,
      role: userDoc.role,
    };
    const jwt = await authService.makeUserJWT(jwtSource);

    return cwr.createWebResp(res, 200, jwt);
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - postLogin`, error.message);
  }
};

// jwt 로그인
const getJwtLogin = async (req, res) => {
  try {
    const { id, email, displayName, photoURL, role } = req.decoded;

    const user = { id, email, displayName, photoURL, role };

    if (role !== "user") {
      return cwr.errorWebResp(res, 403, `E0000 - 사용자 계정이 아닙니다.`);
    }

    return cwr.createWebResp(res, 200, { user });
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - getJwtLogin`, error.message);
  }
};

// 자기정보 조회
const getMe = async (req, res) => {
  try {
    const { id } = req.decoded;

    const userDoc = await userService.findById(id);
    const didDoc = await didService.getDidsByUserIdForProfile(id);

    const { _id, name, displayName, email, point, publicKey, privateKey } =
      userDoc;

    const profile = {
      _id,
      name,
      displayName,
      email,
      point,
      publicKey,
      privateKey,
    };

    const result = { ...profile, didDoc };

    return cwr.createWebResp(res, 200, result);
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - getMe`, error.message);
  }
};

// 화원 탈퇴
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.decoded;
    await userService.deleteUserById(id);
    await didService.deleteDidByUserId(id);
    await transactionService.deleteTransactionByUserId(id);

    return cwr.createWebResp(res, 200, { delete: "success" });
  } catch (error) {
    return cwr.errorWebResp(res, 403, `E0000 - deleteAccount`, error.message);
  }
};

module.exports = {
  postRegister,
  postLogin,
  getJwtLogin,
  getMe,
  deleteAccount,
};
