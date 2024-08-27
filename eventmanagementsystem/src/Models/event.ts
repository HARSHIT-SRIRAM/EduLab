import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./users";
import { Participant } from "./participant";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "varchar", length: 255 })
  location: string;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "datetime" })
  eventStartTime: Date;

  @Column({ type: "int", default: 0 })
  participantLimit: number;

  @ManyToOne(() => User, (user) => user.organizedEvents)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Participant, (participant) => participant.event)
  participants: Participant[];
}
