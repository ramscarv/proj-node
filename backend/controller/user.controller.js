import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../config/auth.js";

export class UserController {
  constructor(UserModel) {
    this.user = UserModel;
  }

  async getAll() {
    const users = await this.user.findAll();
    return users;
  }

  async get(userId) {
    const users = await this.user.findAll({
      where: {
        id: userId
      }
    });
    return users;
  }

  async adicionar(userDTO) {
    let userExist = await this.user.findOne({
      where: {
        email: userDTO.email
      }
    });

    if (userExist) {
      return {
        error: true,
        message: 'Usuário já existente!'
      };

    }

    const { name, email, password } = userDTO;
    const userNew = { name, email, password };

    //Criptografar a senha 
    userNew.password = await bcrypt.hash(userNew.password, 8);

    try {
      const userCreate = await this.user.create(userNew);
      return userCreate;
    } catch (error) {
      console.log(error)
    }
  }

  async login(userDTO) {
    let userExist = await this.user.findOne({
      where: {
        email: userDTO.email
      }
    });

    if (!userExist) {
      return {
        error: true,
        message: 'Usuário não existe'
      };
    }

    // Como o usuário existe vanmos verificar se a senha está correta
    if (!(await bcrypt.compare(userDTO.password, userExist.password))) {
      return {
        error: true,
        message: 'Senha inválida'
      };
    }

    // Usuário existe E senha correta
    return {
      error: false,
      user: {
        name: userExist.name,
        email: userExist.email,
      },
      token: jwt.sign({ id: userExist.id }, auth.secret, {
        expiresIn: auth.expireIn,
      }),
    };
  }
}