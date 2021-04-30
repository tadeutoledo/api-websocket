import { getCustomRepository, Repository } from "typeorm";
import { Setting } from "../entities/Setting";

import { SettingsRepository } from "../repositories/SettingsRepository";

interface ISettings {
  chat: boolean;
  username: string;
}

export class SettingsService {
  private settingsRepository: Repository<Setting>;

  constructor() {
    this.settingsRepository = getCustomRepository(SettingsRepository);
  }

  async create({ chat, username }: ISettings): Promise<Setting> {

    const userAlreadyExists = await this.settingsRepository.findOne(({
      username
    }));

    if (userAlreadyExists) {
      throw new Error('O usuário já existe.');
    }

    const settings = this.settingsRepository.create({
      chat,
      username
    })

    return await this.settingsRepository.save(settings);

  }

  async findByUsername(username: string) {
    const setting = await this.settingsRepository.findOne({
      username
    });

    return setting;
  }

  async updateChat({ username, chat }: ISettings) {
    const updateSetting = await this.settingsRepository
      .createQueryBuilder()
      .update(Setting)
      .set({ chat })
      .where('username = :username', { username })
      .execute();
  }
}