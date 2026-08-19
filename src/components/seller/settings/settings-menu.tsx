"use client";

import { useRouter } from "next/navigation";
import { CreditCard, KeyRound, LogOut, Trash2, UserPen } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { DeleteAccountModal } from "@/components/seller/settings/delete-account-modal";
import { SettingsItem } from "@/components/seller/settings/settings-item";
import { useState } from "react";

import { useAppDispatch, useAppSelector, type RootState } from "@/store";
import { logout } from "@/store/features/auth/authSlice";
import { useLogoutMutation } from "@/store/features/auth/authApi";
import toast from "react-hot-toast";

export function SettingsMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();
  const refreshToken = useAppSelector((state: RootState) => state.auth.refreshToken);
  const [showDelete, setShowDelete] = useState(false);

  const handleDeleteConfirm = () => {
    setShowDelete(false);
    dispatch(logout());
    toast.success("Account deleted");
    router.push(ROUTES.auth.signIn);
  };

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logoutApi({ refresh: refreshToken }).unwrap();
      }
    } catch {
      // ignore network errors on logout
    } finally {
      dispatch(logout());
      toast.success("Logged out successfully");
      router.push(ROUTES.auth.signIn);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <SettingsItem
          icon={UserPen}
          label="Edit personal Info"
          href={ROUTES.seller.settingsEditProfile}
          variant="default"
        />
        <SettingsItem
          icon={KeyRound}
          label="Change Password"
          href={ROUTES.seller.settingsChangePassword}
          variant="default"
        />
        <SettingsItem
          icon={CreditCard}
          label="Payment Methods"
          href={ROUTES.seller.settingsPaymentMethods}
          variant="default"
        />
        <SettingsItem
          icon={Trash2}
          label="Delete Account"
          variant="danger"
          onClick={() => setShowDelete(true)}
        />
        <SettingsItem icon={LogOut} label="Logout" variant="logout" onClick={handleLogout} />
      </div>

      <DeleteAccountModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
