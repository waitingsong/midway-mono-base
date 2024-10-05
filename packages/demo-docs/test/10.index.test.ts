import assert from 'node:assert/strict'

import { fileShortPath } from '@waiting/shared-core'

import {
  ErrorCode,
  GetUserDTO,
  HeadersKey,
  LoginDTO,
  TbAppDO,
  TbMemberDO,
  UserDetailDTO,
  userValidSchemas,
} from '../src/index.js'


describe(fileShortPath(import.meta.url), () => {

  describe('should work', () => {
    it('HeadersKey', () => {
      assert(HeadersKey)
      assert(Object.keys(HeadersKey).length > 0)
    })

    it('ErrorCode', () => {
      assert(ErrorCode)
      assert(Object.keys(ErrorCode).length > 0)
    })

    it('userValidSchemas', () => {
      assert(userValidSchemas)
      assert(Object.keys(userValidSchemas).length > 0)
    })

    it('TbAppDO', () => {
      assert(TbAppDO)
      const app = new TbAppDO()
      assert(Object.hasOwn(app, 'ctime'))
    })

    it('TbMemberDO', () => {
      assert(TbMemberDO)
      const member = new TbMemberDO()
      assert(Object.hasOwn(member, 'ctime'))
    })

    it('GetUserDTO', () => {
      assert(GetUserDTO)
      const inst = new GetUserDTO()
      assert(Object.hasOwn(inst, 'uid'))
    })

    it('UserDetailDTO', () => {
      assert(UserDetailDTO)
      const inst = new UserDetailDTO()
      assert(Object.hasOwn(inst, 'uid'))
    })

    it('LoginDTO', () => {
      assert(LoginDTO)
      const inst = new LoginDTO()
      assert(Object.hasOwn(inst, 'username'))
    })
  })

})

