import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import { Channel } from "./channel.entity";
import { ChannelRepository } from "./channel.repository";
import {
  ChannelIdDto,
  ChannelInfoDto,
  InteractionDto,
  JoinProtectedChannelDto,
  RestrictionDto,
  SendMessageDto,
} from "./dto/channel.dto";

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelRepository)
    private readonly channelRepository: ChannelRepository,
    private readonly usersService: UsersService
  ) {}

  async createChannel(
    login42: string,
    createChannelDto: ChannelInfoDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.createChannel(user, createChannelDto);
  }

  async updateChannel(
    login42: string,
    channelId: string,
    updateChannelDto: ChannelInfoDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.updateChannel(
      user,
      channelId,
      updateChannelDto
    );
  }

  async joinProtectedChannel(
    login42: string,
    joinProtectedChannelDto: JoinProtectedChannelDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.joinProtectedChannel(
      user,
      joinProtectedChannelDto
    );
  }

  async joinChannel(
    login42: string,
    joinChannelDto: ChannelIdDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.joinChannel(user, joinChannelDto);
  }

  async inviteToChannel(
    login42: string,
    inviteToChannelDto: InteractionDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.inviteToChannel(user, inviteToChannelDto);
  }

  async leaveChannel(
    login42: string,
    leaveChannelDto: ChannelIdDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.leaveChannel(user, leaveChannelDto);
  }

  async muteAChannelUser(
    login42: string,
    muteAChannelUserDto: RestrictionDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.muteAChannelUser(user, muteAChannelUserDto);
  }

  async banAChannelUser(
    login42: string,
    banAChannelUserDto: RestrictionDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.banAChannelUser(user, banAChannelUserDto);
  }

  async setAChannelAdmin(
    login42: string,
    setAChannelAdminDto: InteractionDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.setAChannelAdmin(user, setAChannelAdminDto);
  }

  async unsetAChannelAdmin(
    login42: string,
    unsetAChannelAdminDto: InteractionDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.unsetAChannelAdmin(
      user,
      unsetAChannelAdminDto
    );
  }

  async sendMSGToChannel(
    login42: string,
    sendMSGToChannelDto: SendMessageDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.sendMSGToChannel(user, sendMSGToChannelDto);
  }

  async getChannel(login42: string, channelId: string): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.getChannel(user, channelId);
  }

  async getInvitableFriends(
    login42: string,
    channelId: string
  ): Promise<User[]> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.getInvitableFriends(user, channelId);
  }

  async getPublicChannels(login42: string): Promise<Channel[]> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.getPublicChannels(user);
  }

  async getJoinedChannels(login42: string): Promise<Channel[]> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.getJoinedChannels(user);
  }
}
