import { compare, hash } from "bcryptjs"

const CAM_GLOBAL_HASHED_PW = "$2a$10$PHlFiKRKk/evU3hw0CVYDO8jdVSrWWLktfRlOcPel35TiCbQg1K4e" // this_is_a_test

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


async function hash_pw(pwd) {
  const SALT_ROUNDS = 10

  const hashed_pw = await hash(pwd, SALT_ROUNDS)

  return hashed_pw
}


// console.log("hashing: ", await hash_pw("this_is_a_test"))
