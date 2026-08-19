import { ProfileForm } from "./profile-form";
import { AvatarUpload } from "./avatar-upload";
import { ChangePasswordForm } from "./change-password-form";

export function ProfileView() {
  return (
    <>
      <ProfileForm />
      <AvatarUpload />
      <ChangePasswordForm />
    </>
  );
}
