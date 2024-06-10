import {request, Request, Response} from 'express';
import nodemailer from "nodemailer";

// Controller to get all user request from frontend and send to admin mail 
const requestSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const { songName, description, email} = req.body;
        //send mail to admin with user request data using nodemailer
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "manushadananjaya999@gmail.com",
            pass: "tums mfyz lncy tmhk",
          },
        });

        const mailOptions = {
          from: "manushadananjaya999@gmail.com",
          to: process.env.ADMIN_EMAIL,
          subject: "Song Request",
          text: `Song Name: ${songName}, Description: ${description}, Email: ${email}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        

        res.status(200).json({message: "Request sent successfully"});
    } catch (error) {
        res.status(500).json({error: "An error occurred while sending request"});
    }
};

export {requestSong};
