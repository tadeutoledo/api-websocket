import { Request, Response } from "express"

import { SettingsService } from "../services/SettingsService";

export class SettingsController {
  async create(request: Request, response: Response) {

    const { chat, username } = request.body;

    try {
      const service = await new SettingsService().create({
        chat,
        username
      });

      response
        .status(200)
        .json(service);
    } catch (error) {
      response
        .status(400)
        .send({
          message: error.message
        });
    }
  };

  async findByUsername(request: Request, response: Response) {

    const { username } = request.params;

    try {
      const setting = await new SettingsService().findByUsername(username);

      response
        .status(200)
        .json(setting);

    } catch (error) {
      response
        .status(400)
        .send({
          message: error.message
        });
    }
  };

  async updateChat(request: Request, response: Response) {

    const { username } = request.params;
    let chat: boolean = true;

    console.log(typeof chat);

    chat = request.body.chat;

    console.log(typeof chat);

    try {
      const setting = await new SettingsService().updateChat({
        username,
        chat
      });

      response
        .status(200)
        .json(setting);

    } catch (error) {
      response
        .status(400)
        .send({
          message: error.message
        });
    }
  };
}
