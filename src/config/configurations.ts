export default () => ({
    port: parseInt(process.env.PORT!, 10) || 4000,
    database: {
        localUri: process.env.MONGODB_URI,
        onlineUri: process.env.ONLINE_MONGODB_URI,
    },
    encryption: {
        key: process.env.ENCRYPTION_KEY,
        ivLength: parseInt(process.env.IV_LENGTH!, 10) || 16,
    },
    jwt: {
        user: {
            accessSecret: process.env.ACCESS_SECRET_KEY_USER,
            refreshSecret: process.env.REFRESH_SECRET_KEY_USER,
            prefix: process.env.PREFIX_USER,
        },
        admin: {
            accessSecret: process.env.ACCESS_SECRET_KEY_ADMIN,
            refreshSecret: process.env.REFRESH_SECRET_KEY_ADMIN,
            prefix: process.env.PREFIX_ADMIN,
        },
        expires_in:process.env.JWT_EXPIRES_IN!
    },
    redis: {
        url: process.env.REDIS_URL,
    },
    mail: {
        appMail: process.env.APPE_MAIL,
        password: process.env.SENDING_EMAIL_PASSWORD,
    },
    whiteList: process.env.WHITE_LIST ? process.env.WHITE_LIST.split(',') : [],
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucketName: process.env.AWS_S3_BUCKET_NAME,
        s3FolderName:process.env.S3_MAIN_FOLDER_NAME
    },
});