"""
Email HTML templates.

Design decisions:
- Pure Python f-strings — no Jinja2 dependency, keeps it lightweight
- Inline CSS only — email clients strip <style> tags
- Table-based layout — maximum email client compatibility
- Single function per template type — easy to extend later
"""

import json
from app.models.order import Order


def build_order_confirmation_email(order: Order, user_full_name: str) -> tuple[str, str]:
    """
    Returns (subject, html_body) for an order confirmation email.

    Includes:
    - Thank you message with customer name
    - Order number and date
    - Itemised product list
    - Pricing summary (subtotal, discount, delivery, grand total)
    - Shipping address
    - Payment method
    - Support footer
    """

    subject = f"Order Confirmed! #{order.order_number} — Thank you for shopping with us"

    #  Parse shipping address 
    try:
        addr = json.loads(order.shipping_address)
    except (json.JSONDecodeError, TypeError):
        addr = {}

    shipping_name    = addr.get("full_name", "Customer")
    shipping_phone   = addr.get("phone", "")
    shipping_address = addr.get("address", "")
    shipping_city    = addr.get("city", "")
    shipping_state   = addr.get("state", "")
    shipping_pincode = addr.get("pincode", "")

    #  Build order items rows 
    items_rows = ""
    for item in order.items:
        items_rows += f"""
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; vertical-align: top;">
            <div style="font-size: 14px; font-weight: 600; color: #212121;">{item.title}</div>
            {f'<div style="font-size: 12px; color: #878787; margin-top: 2px;">{item.brand}</div>' if item.brand else ''}
            <div style="font-size: 12px; color: #878787; margin-top: 2px;">Qty: {item.quantity}</div>
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align: right; vertical-align: top;">
            <div style="font-size: 14px; font-weight: 600; color: #212121;">₹{item.total_price:,.2f}</div>
            <div style="font-size: 12px; color: #878787;">₹{item.unit_price:,.2f} each</div>
          </td>
        </tr>
        """

    #  Payment method label 
    payment_labels = {
        "cod": "Cash on Delivery",
        "upi": "UPI",
        "card": "Credit / Debit Card",
    }
    payment_label = payment_labels.get(order.payment_method, order.payment_method.upper())

    #  Delivery row — free or charged 
    delivery_row = (
        '<tr>'
        '<td style="padding: 6px 0; font-size: 13px; color: #878787;">Delivery</td>'
        f'<td style="padding: 6px 0; font-size: 13px; color: #878787; text-align: right;">'
        f'{"FREE" if order.delivery_charge == 0 else f"₹{order.delivery_charge:,.2f}"}'
        '</td></tr>'
    )

    #  Discount row — only if applicable 
    discount_row = ""
    if order.total_discount > 0:
        discount_row = (
            '<tr>'
            '<td style="padding: 6px 0; font-size: 13px; color: #388E3C;">Discount</td>'
            f'<td style="padding: 6px 0; font-size: 13px; color: #388E3C; text-align: right;">'
            f'-₹{order.total_discount:,.2f}'
            '</td></tr>'
        )

    #  Formatted order date 
    order_date = order.created_at.strftime("%d %B %Y, %I:%M %p") if order.created_at else "—"

    #  Full HTML 
    html_body = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F3F6; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F1F3F6; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="max-width: 600px; background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">

          <!--  Header  -->
          <tr>
            <td style="background-color: #2874F0; padding: 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 24px; font-weight: bold; color: #ffffff; font-style: italic;">
                      Flipkart
                    </span>
                    <span style="font-size: 10px; color: #FFE500; font-style: italic; margin-left: 4px;">
                      Explore Plus+
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size: 12px; color: #bbdefb;">Order Confirmation</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!--  Hero message  -->
          <tr>
            <td style="padding: 32px 32px 0 32px; text-align: center;">
              <div style="width: 56px; height: 56px; background-color: #E8F5E9; border-radius: 50%;
                          display: inline-flex; align-items: center; justify-content: center;
                          margin-bottom: 16px; line-height: 56px;">
                <span style="font-size: 28px;">✓</span>
              </div>
              <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 700; color: #212121;">
                Order Confirmed!
              </h1>
              <p style="margin: 0; font-size: 14px; color: #878787; line-height: 1.6;">
                Hi <strong style="color: #212121;">{user_full_name}</strong>, thank you for your order.
                <br />We've received it and will keep you updated.
              </p>
            </td>
          </tr>

          <!--  Order meta  -->
          <tr>
            <td style="padding: 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background-color: #F8F9FA; border-radius: 4px; padding: 16px;">
                <tr>
                  <td style="padding: 8px 16px;">
                    <div style="font-size: 11px; color: #878787; text-transform: uppercase;
                                letter-spacing: 0.5px; margin-bottom: 4px;">Order Number</div>
                    <div style="font-size: 15px; font-weight: 700; color: #2874F0;">
                      #{order.order_number}
                    </div>
                  </td>
                  <td style="padding: 8px 16px;">
                    <div style="font-size: 11px; color: #878787; text-transform: uppercase;
                                letter-spacing: 0.5px; margin-bottom: 4px;">Order Date</div>
                    <div style="font-size: 13px; font-weight: 600; color: #212121;">
                      {order_date}
                    </div>
                  </td>
                  <td style="padding: 8px 16px;">
                    <div style="font-size: 11px; color: #878787; text-transform: uppercase;
                                letter-spacing: 0.5px; margin-bottom: 4px;">Payment</div>
                    <div style="font-size: 13px; font-weight: 600; color: #212121;">
                      {payment_label}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!--  Order items  -->
          <tr>
            <td style="padding: 0 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700;
                          color: #212121; border-bottom: 2px solid #2874F0;
                          padding-bottom: 8px;">
                Order Summary
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                {items_rows}
              </table>
            </td>
          </tr>

          <!--  Pricing summary  -->
          <tr>
            <td style="padding: 20px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border-top: 1px solid #f0f0f0; padding-top: 16px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #878787;">Subtotal</td>
                  <td style="padding: 6px 0; font-size: 13px; color: #878787; text-align: right;">
                    ₹{order.subtotal:,.2f}
                  </td>
                </tr>
                {discount_row}
                {delivery_row}
                <tr>
                  <td style="padding: 12px 0 4px 0; font-size: 16px; font-weight: 700;
                              color: #212121; border-top: 1px solid #f0f0f0;">
                    Total Paid
                  </td>
                  <td style="padding: 12px 0 4px 0; font-size: 16px; font-weight: 700;
                              color: #212121; text-align: right; border-top: 1px solid #f0f0f0;">
                    ₹{order.grand_total:,.2f}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!--  Shipping address   -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700;
                          color: #212121; border-bottom: 2px solid #2874F0;
                          padding-bottom: 8px;">
                Delivering To
              </h2>
              <div style="font-size: 14px; font-weight: 600; color: #212121; margin-bottom: 4px;">
                {shipping_name}
              </div>
              <div style="font-size: 13px; color: #878787; line-height: 1.7;">
                {shipping_address}<br />
                {shipping_city}, {shipping_state} — {shipping_pincode}<br />
                <span style="color: #212121;">📞 {shipping_phone}</span>
              </div>
            </td>
          </tr>

          <!--  Delivery note  -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background-color: #E3F2FD; border-radius: 4px; border-left: 4px solid #2874F0;">
                <tr>
                  <td style="padding: 14px 16px; font-size: 13px; color: #1565C0; line-height: 1.6;">
                    🚚 <strong>Your order is confirmed</strong> and will be delivered within
                    <strong>3–7 business days</strong>. You'll receive tracking updates soon.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!--  Footer   -->
          <tr>
            <td style="background-color: #F8F9FA; padding: 20px 32px; border-top: 1px solid #f0f0f0;">
              <p style="margin: 0; font-size: 12px; color: #878787; text-align: center; line-height: 1.8;">
                Need help? Contact us at
                <a href="mailto:support@flipkartclone.com"
                   style="color: #2874F0; text-decoration: none;">
                  support@flipkartclone.com
                </a>
                <br />
                © 2025 Flipkart Clone. Built for Scaler SDE Internship Assignment.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    """

    return subject, html_body