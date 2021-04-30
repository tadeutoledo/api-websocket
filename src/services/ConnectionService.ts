import { getCustomRepository, IsNull, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { User } from "../entities/User";

import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate {
  socket_id: string;
  user_id: string;
  admin_id?: string;
  id?: string;
}

interface IConnectionUpdate {
  socket_id: string;
  user_id: string;
  admin_id?: string;
}

export class ConnectionService {
  private connectionsRepository: Repository<Connection>;

  constructor() {
    this.connectionsRepository = getCustomRepository(ConnectionsRepository);
  }

  async create({ socket_id, user_id, admin_id, id }: IConnectionCreate) {
    const connection = this.connectionsRepository.create({
      socket_id,
      user_id,
      admin_id,
      id
    });

    await this.connectionsRepository.save(connection);

    //console.log('create ' + connection);

    return connection;
  }

  async findByUserId(user_id: string) {
    const connection = await this.connectionsRepository.findOne({
      where: { user_id },
      order: {
        created_at: "DESC"
      },
      relations: ['user']
    });

    return connection;
  }

  async findByUserIdWithAdmin(user_id: string) {
    const connection = await this.connectionsRepository
      .createQueryBuilder('connection')
      .innerJoinAndMapOne('connection.user', User, 'user', 'user_id = :user_id')
      .where('user_id = :user_id and admin_id is not null', { user_id })
      .orderBy('connection.created_at', "DESC")
      .getOne();

    return connection;
  }

  async findAllWithoutAdmin() {

    const connections = await this.connectionsRepository
      .createQueryBuilder('connection')
      .innerJoinAndMapOne('connection.user', User, 'user', 'user_id = user.id')
      .orderBy('connection.created_at', "DESC")
      .groupBy('connection.user_id')
      .getMany();

    return connections;
  }

  async updateAdminSocketId({ socket_id, admin_id, user_id }: IConnectionUpdate) {

    const connections = await this.connectionsRepository
      .createQueryBuilder('connection')
      .update(Connection)
      .set({ admin_id })
      .where('user_id = :user_id', { user_id })
      .execute();

    console.log('update ' + admin_id + '  socket ' + socket_id + ' user ' + user_id);
    return connections;
  }
}