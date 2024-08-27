import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Event } from "./event";
import { User } from "./users";

@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.participants)
  event: Event;

  @ManyToOne(() => User, (user) => user.participants)
  user: User;
}
