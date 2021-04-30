import { getCustomRepository, Repository } from "typeorm";

import { User } from "../entities/User";
import { UsersRepository } from "../repositories/UsersRepository";

interface IUserCreate {
  email: string;
}


export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getCustomRepository(UsersRepository);
  }

  async create({ email }: IUserCreate): Promise<User> {
    const user = await this.userRepository.findOne({ email });

    if (user) {
      return user;
    }

    const newUser = this.userRepository.create({
      email
    });

    return await this.userRepository.save(newUser);
  }

  async getById(id: string) {
    return await this.userRepository.findOne({
      id
    });
  }

}