const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'toksho.comic@gmail.com',
    pass: process.env.MAILER_KEY,
  }
});

exports.mail = async(mail, trackingCode) => {
  const info = await transporter.sendMail({
    from: '"Toksho Comics" <toksho.comic@gmail.com>',
    to: mail,
    subject: "¡Tu pedido está en camino!",
    text: "Aquí está tu código de seguimiento",
    html: `
    <div style="display: grid; background-color: #86BBD8; border: 2px solid; max-width: 720px; padding: 8px; margin-left: auto; margin-right: auto;">
      <div style="display: grid;">
        <span style="font-size: 24px; font-weight: bold; background-color: #eeba5e; border: 2px solid; padding: 16px;">¡TU PEDIDO ESTÁ EN CAMINO!</span>
        <span style="margin-top: 8px; margin-bottom: 8px;">
          Hola, aquí tienes el código de seguimiento de tu compra: <b>${trackingCode}</b>.
          También podés ver el estado del envío <a href="https://www.andreani.com/#!/personas" target="_blank">haciendo click acá</a>.
        </span>
      </div>
      <img
        style="width: 150px; margin-left: auto; margin-right: auto; margin-top: 48px;"
        src="https://ixjtiaxfychgauasmxrl.supabase.co/storage/v1/object/public/logo/toksho-logo.png?t=2023-07-27T01%3A05%3A35.979Z"
        alt="toksho logo"
      />
    </div>
    `,
  });

  return info;
};