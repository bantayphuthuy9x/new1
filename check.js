const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { paymentMethodId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      capture_method: "manual"
    });

    if (paymentIntent.status === "requires_capture") {
      res.status(200).json({ message: "✅ Thẻ hợp lệ và đủ tiền!" });
    } else {
      res.status(400).json({ message: "❌ Thẻ không đủ tiền hoặc không xác định được trạng thái." });
    }
  } catch (err) {
    res.status(200).json({ message: `❌ Lỗi: ${err.message}` });
  }
}
