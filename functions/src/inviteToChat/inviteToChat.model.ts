import { object, string } from "yup";

export interface InviteToChatBodyData {
  chatId: string;
  email: string;
}
export const inviteToChatBodySchema = object().shape<InviteToChatBodyData>({
  chatId: string().required(),
  email: string().email().required(),
});
