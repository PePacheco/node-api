import path from 'path';
import uploadConfig from '@config/upload';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface Request {
    userId: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}
    
    public async execute({ userId, avatarFilename }: Request) : Promise<User>{
        const user = await this.usersRepository.findById(userId);

        if(!user) {
            throw new AppError('Only authenticated users can change avatar', 401);
        }

        if(user.avatar) {
             await this.storageProvider.deleteFile(user.avatar);
        }

        const fileName = await this.storageProvider.saveFile(avatarFilename);

        user.avatar = avatarFilename;
        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;