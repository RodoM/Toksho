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

exports.mail = async(orderId, name, mail, items) => {

  let formatedItems = items.map(
    (item, index) => `
      <tr style="background-color: ${index % 2 === 0 ? '#86BBD8' : '#33658A'};">
        <td style="color: white; border: 2px solid black;border-collapse: collapse; padding: 4px;">${item.title}</td>
        <td style="color: white; border: 2px solid black;border-collapse: collapse;text-align: center; padding: 4px;">${item.quantity}</td>
        <td style="color: white; border: 2px solid black;border-collapse: collapse;text-align: center; padding: 4px;">$${item.unit_price}</td>
      </tr>
    `
  ).join('');

  const calculatePrice = () => {
    return items.reduce((total, item) => total + parseFloat(item.unit_price), 0);
  };

  const info = await transporter.sendMail({
    from: '"Toksho Comics" <toksho.comic@gmail.com>',
    to: mail,
    subject: "Compra en Toksho Comics",
    text: "Gracias por comprar en Toksho Comics",
    html: `
    <div style="display: grid; background-color: #86BBD8; border: 2px solid; max-width: 720px; padding: 8px; margin-left: auto; margin-right: auto;">
      <div style="display: grid;">
        <span style="font-size: 24px; font-weight: bold; background-color: #eeba5e; border: 2px solid; padding: 16px;">GRACIAS POR TU COMPRA</span>
        <span style="margin-top: 8px; margin-bottom: 8px;">Hola ${name}, recibimos tu pedido <b>#${orderId}</b></span>
      </div>
      <table style="border: 2px solid; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #EEBA5E;">
            <th style="border: 2px solid; border-collapse: collapse; text-align: left; padding: 4px;">Nombre</th>
            <th style="border: 2px solid; border-collapse: collapse; padding: 4px;">Cantidad</th>
            <th style="border: 2px solid; border-collapse: collapse; padding: 4px;">Precio</th>
          </tr>
        </thead>
        <tbody>
          ${formatedItems}
          <tr style="background-color: #EEBA5E;">
            <td colspan="2" style="padding: 4px;"><b>Total:</b></td>
            <td style="text-align: center; padding: 4px;">$${calculatePrice()}</td>
          </tr>
        </tbody>
      </table>
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