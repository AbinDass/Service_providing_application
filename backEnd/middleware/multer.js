import { S3Client } from "@aws-sdk/client-s3";
import { S3 } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import multer from "multer";

const s3Client = new S3Client({
    region: "ap-northeast-1",
    credentials: {
        secretAccessKey: "pJbtu3skOMWpM1YL6GOltV9CnlYxzQRKHE16ktMZ",
        accessKeyId: "AKIATNWFNVGSIHZIVUKT",
        region: "ap-northeast-1",
    },
});

const storage = multerS3({
    s3: s3Client,
    bucket: "serviceappdas",
    key: function (req, file, cb) {
        console.log(file, "i made it");
        // cb(null, "/" + Date.now().toString() + file.originalname);
        cb(null, "/" + Date.now().toString() + file.originalname);
    },
});

const upload = multer({ storage: storage });

export default upload;
