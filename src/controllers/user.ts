//controllers/user.ts

import { BaseContext } from 'koa';
import { getManager, Repository, Not, Equal } from 'typeorm';
import { validate, ValidationError } from 'class-validator';

/*
export default class UserController {

    public static async getUsers (ctx: BaseContext) {

    }

    public static async getUser (ctx: BaseContext) {


    }

    public static async createUser (ctx: BaseContext) {

        }
    }

    public static async updateUser (ctx: BaseContext) {


    }

    public static async deleteUser (ctx: BaseContext) {

  }
  */