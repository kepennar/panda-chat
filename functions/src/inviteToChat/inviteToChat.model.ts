
import {object, string} from 'yup'

export interface InviteToChatBody {
  chatId: string;
  email: string;
}
export const inviteToChatBodySchema = object().shape<InviteToChatBody>({
  chatId: string().required(),
  email: string().email(),
});
