import { Request, Response } from "express"
import { UserService } from "../services/UserService"

export class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const usersService = new UserService();
    const user = await usersService.create({ email });

    return response
      .status(200)
      .json(user);
  }
}
