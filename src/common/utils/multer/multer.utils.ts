import multer from 'multer';
import { MimeTypesEnum } from './../../enum/multer.enum';
import { StorageEnum } from "src/common/enum/multer.enum";
import { Request } from 'supertest';
import { BadGatewayException } from '@nestjs/common';
import { tmpdir } from 'node:os';

export let multerCloud = ({
    storageType = StorageEnum.memory,
    fileType = MimeTypesEnum.images,
    maxFileSize=5 * 1024 * 1024
}:
{
    storageType?:StorageEnum,
    fileType:String[],
    maxFileSize?:number
}) => {
    let storage = storageType == StorageEnum.memory? multer.memoryStorage()
    : multer.diskStorage({
        destination: tmpdir(),
        filename(req, file, callback) {
            callback(null,Date.now()+file.originalname)
        },
    })

    let fileFilter = (req:Request, file:Express.Multer.File, callback) => {
        if(!fileType.includes(file.mimetype)){
            return callback(new BadGatewayException("invalid field type"),false)
        }
        return callback(null,true)
    }

    return {
        storage,
        fileFilter
    }
}