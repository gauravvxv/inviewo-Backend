const pool = require('../config/db');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
dotenv.config();


const postBooking = async (req,res) => {
    const {name,email,phone_number,domain,experience,bio,resume_link} = req.body;
    try {
        const result = await pool.query('insert into bookings (name,email,phone_number,domain,experience,bio,resume_link) values ($1,$2,$3,$4,$5,$6,$7) returning *',
            [name,email,phone_number,domain,experience,bio,resume_link]
        )

        const booking = result.rows[0];

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const adminEmails = process.env.ADMIN_EMAIL.split(',');

         const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmails, 
      subject: 'New Session Booked',
      text: `
        A new session has been booked.

        Name: ${name}
        Email: ${email}
        Phone: ${phone_number}
        Domain: ${domain}
        Experience: ${experience}
        Bio: ${bio}
        Resume Link: ${resume_link}
      `,
    };

     const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Session Booking Confirmation',
      text: `
        Hi ${name},

        Thank you for booking your session with us!

        Here are your booking details:
        Domain: ${domain}
        Experience: ${experience}
        Phone: ${phone_number}
        Bio: ${bio}
        Resume Link: ${resume_link}

        We will contact you soon with further details.

        Regards,
        Nexvue
      `,
    };

     await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

        res.status(201).json({message: "Booking Data is Added and emails sent",booking})
    } catch (error) {
        res.status(401).json({error: error})
    }
}

const getBooking = async (req,res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('SELECT * FROM bookings WHERE session_id = $1',[id]);

        
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(result.rows[0]);

    } catch (error) {
     res.status(500).json({ error: error });    
    }
}

const updateBooking = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

  try {
    const result = await pool.query(
      `UPDATE bookings SET ${setClause} WHERE session_id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Profile updated', booking: result.rows[0] });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = updateBooking;



module.exports = {postBooking,getBooking,updateBooking}