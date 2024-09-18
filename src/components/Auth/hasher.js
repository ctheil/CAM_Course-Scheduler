import { compare, hash } from "bcryptjs"

const CAM_GLOBAL_HASHED_PW = "$2a$10$c.gv8ltCifGObtGW85sqk.828r1TBCqZ88ykuKgq0BJKixi3f.d1S"

/**
 * Compares plain text password with hashed CAM_GLOBAL_HASHED_PW
 * @param {string} pwd - Plain text password
 * @param {string} hashed_pwd - stored hashed password
 * @returns { Promise<boolean> }
 */
export async function compare_pwd(pwd, hashed_pwd = CAM_GLOBAL_HASHED_PW) {
  console.log("compre_pwd", pwd)
  const is_valid = await compare(pwd, hashed_pwd)

  return is_valid
  // return false
}


export async function hash_pw(pwd) {
  const SALT_ROUNDS = 10

  const hashed_pw = await hash(pwd, SALT_ROUNDS)

  return hashed_pw
}

export function compare_hashed(pwd) {
  return pwd === CAM_GLOBAL_HASHED_PW
}


console.log("hashing: ", await hash_pw("auth3nt!cat1on_13_n1c}"))
