import { Entity, Column, CreateDateColumn, PrimaryColumn, OneToMany } from "typeorm"

import { v4 as uuid } from "uuid"
import { Message } from "./Message";

@Entity('users')
export class User {

  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }

  }
}