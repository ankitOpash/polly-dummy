
import { InviteCustomerTemplate } from './InviteCustomerTemplate'
import { InviteTeamTemplate } from './InviteTeamTemplate'
import { ResetPasswordTemplate } from './ResetPasswordTemplate'
import { VerifyEmailTemplate } from './VerifyEmail'
import { WelcomeEmailTemplate } from './WelcomeEmail'

class _EmailTemplates {

  resetPassword({ userName, link }) {
    return ResetPasswordTemplate({ userName, link })
  }

  verifyEmail({ link, newEmail, userName }) {
    return VerifyEmailTemplate({ link, newEmail, userName })
  }

  inviteTeam({ origin, link, companyName, company, userData }) {
    return InviteTeamTemplate({ origin, link, userData })
  }

  inviteCustomer({ origin, link, companyName, company, userData }) {
    return InviteCustomerTemplate({ origin, link, userData })
  }

  welcomeEmail({ userName, link }) {
    return WelcomeEmailTemplate({ userName, link })
  }
}

export const EmailTemplates = new _EmailTemplates()