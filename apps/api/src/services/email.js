const nodemailer = require('nodemailer')

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// Email templates
const templates = {
  verification: (data) => ({
    subject: 'MarketAI 이메일 인증',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
          <h1>MarketAI</h1>
        </div>
        <div style="padding: 30px;">
          <h2>안녕하세요, ${data.name}님!</h2>
          <p>MarketAI에 가입해 주셔서 감사합니다.</p>
          <p>아래 버튼을 클릭하여 이메일 인증을 완료해 주세요:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" 
               style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              이메일 인증하기
            </a>
          </div>
          <p>링크가 작동하지 않는다면 아래 URL을 복사하여 브라우저에 붙여넣어 주세요:</p>
          <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            이 이메일은 MarketAI에서 자동으로 발송되었습니다.<br>
            문의사항이 있으시면 support@marketai.com으로 연락해 주세요.
          </p>
        </div>
      </div>
    `
  }),

  'password-reset': (data) => ({
    subject: 'MarketAI 비밀번호 재설정',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
          <h1>MarketAI</h1>
        </div>
        <div style="padding: 30px;">
          <h2>안녕하세요, ${data.name}님!</h2>
          <p>비밀번호 재설정을 요청하셨습니다.</p>
          <p>아래 버튼을 클릭하여 새로운 비밀번호를 설정해 주세요:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" 
               style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              비밀번호 재설정
            </a>
          </div>
          <p>이 링크는 1시간 후에 만료됩니다.</p>
          <p>비밀번호 재설정을 요청하지 않으셨다면 이 이메일을 무시해 주세요.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            이 이메일은 MarketAI에서 자동으로 발송되었습니다.<br>
            문의사항이 있으시면 support@marketai.com으로 연락해 주세요.
          </p>
        </div>
      </div>
    `
  }),

  'bid-notification': (data) => ({
    subject: `[${data.productTitle}] 새로운 입찰이 있습니다`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
          <h1>MarketAI</h1>
        </div>
        <div style="padding: 30px;">
          <h2>새로운 입찰 알림</h2>
          <p>안녕하세요, ${data.userName}님!</p>
          <p>회원님의 상품 <strong>${data.productTitle}</strong>에 새로운 입찰이 있습니다.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>현재 최고가:</strong> ${data.currentPrice.toLocaleString()}원</p>
            <p><strong>입찰자:</strong> ${data.bidderName}</p>
            <p><strong>입찰 시간:</strong> ${data.bidTime}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.auctionUrl}" 
               style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              경매 확인하기
            </a>
          </div>
        </div>
      </div>
    `
  }),

  'auction-end': (data) => ({
    subject: `[${data.productTitle}] 경매가 종료되었습니다`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
          <h1>MarketAI</h1>
        </div>
        <div style="padding: 30px;">
          <h2>경매 종료 알림</h2>
          <p>안녕하세요, ${data.userName}님!</p>
          <p><strong>${data.productTitle}</strong> 경매가 종료되었습니다.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>최종 낙찰가:</strong> ${data.finalPrice.toLocaleString()}원</p>
            ${data.isWinner ? 
              `<p style="color: #10b981;"><strong>축하합니다! 회원님이 낙찰받으셨습니다.</strong></p>` :
              `<p style="color: #ef4444;"><strong>아쉽게도 다른 분이 낙찰받으셨습니다.</strong></p>`
            }
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.auctionUrl}" 
               style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              경매 결과 확인
            </a>
          </div>
        </div>
      </div>
    `
  })
}

// Send email function
const sendEmail = async ({ to, subject, template, data, html }) => {
  try {
    const transporter = createTransporter()

    let emailContent
    if (template && templates[template]) {
      emailContent = templates[template](data)
    } else if (html) {
      emailContent = { subject, html }
    } else {
      throw new Error('No template or HTML content provided')
    }

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'MarketAI'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject: subject || emailContent.subject,
      html: emailContent.html
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Bulk email function
const sendBulkEmail = async (emails) => {
  const results = []
  
  for (const email of emails) {
    try {
      const result = await sendEmail(email)
      results.push({ success: true, messageId: result.messageId, to: email.to })
    } catch (error) {
      results.push({ success: false, error: error.message, to: email.to })
    }
  }
  
  return results
}

module.exports = {
  sendEmail,
  sendBulkEmail,
  templates
}