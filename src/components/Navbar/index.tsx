import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Logo } from "../Logo";
import { Button, Tab, Tabs } from "@nextui-org/react";
import { useAuth } from "@/context/AuthContext";
import { Drawer } from "vaul";
import { useState } from "react";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const signOut = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate({ to: "/sign-in" });
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <nav className="bg-primary p-4">
      <div className="grid grid-cols-3 sm:hidden">
        <div className="col-span-1" />
        <div className="flex items-center space-x-4">
          <Logo />
        </div>
        <div className="col-span-1 flex justify-end">
          <Drawer.Root
            shouldScaleBackground
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          >
            <Drawer.Trigger asChild>
              <Button variant="light" isIconOnly>
                <Icon icon="tabler:menu-2" className="text-white text-xl" />
              </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0">
                <Drawer.Title className="font-medium mb-4" />
                <div className="flex flex-col p-4 space-y-4">
                  <Link
                    to="/teachers"
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-foreground text-lg border-b-primary border-b"
                  >
                    {t("TEACHERS")}
                  </Link>
                  <Link
                    to="/donors"
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-foreground text-lg border-b-primary border-b"
                  >
                    {t("DONORS")}
                  </Link>
                  <Link
                    to="/blog"
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-foreground text-lg border-b-primary border-b"
                  >
                    {t("BLOG")}
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-foreground text-lg border-b-primary border-b"
                  >
                    {t("ABOUT_US")}
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-foreground text-lg border-b-primary border-b"
                  >
                    {t("CONTACT_US")}
                  </Link>

                  <div className="border-t border-gray-200 my-2" />

                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="light"
                      onClick={() => {
                        changeLanguage("en");
                        setIsDrawerOpen(false);
                      }}
                      className={`justify-start ${i18n.language === "en" ? "font-bold" : ""}`}
                    >
                      English
                    </Button>
                    <Button
                      variant="light"
                      onClick={() => {
                        changeLanguage("hy");
                        setIsDrawerOpen(false);
                      }}
                      className={`justify-start ${i18n.language === "hy" ? "font-bold" : ""}`}
                    >
                      Հայերեն
                    </Button>
                    <Button
                      variant="light"
                      onClick={() => {
                        changeLanguage("ru");
                        setIsDrawerOpen(false);
                      }}
                      className={`justify-start ${i18n.language === "ru" ? "font-bold" : ""}`}
                    >
                      Русский
                    </Button>
                  </div>

                  <div className="border-t border-gray-200 my-2" />

                  {isAuthenticated ? (
                    <Button
                      startContent={<Icon icon="tabler:logout" />}
                      color="danger"
                      variant="light"
                      onClick={() => {
                        signOut();
                        setIsDrawerOpen(false);
                      }}
                      className="w-max"
                    >
                      {t("SIGN_OUT")}
                    </Button>
                  ) : (
                    <Button
                      startContent={<Icon icon="tabler:login-2" />}
                      color="primary"
                      variant="light"
                      as={Link}
                      to="/sign-in"
                      className="w-max"
                      onClick={() => {
                        setIsDrawerOpen(false);
                      }}
                    >
                      {t("SIGN_IN")}
                    </Button>
                  )}
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      </div>
      <div className="container mx-auto grid-cols-[1fr_2fr_1fr] gap-4 hidden sm:grid">
        <div className="col-start-1 row-span-2"></div>
        <div className="col-start-2 flex justify-center items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            <Logo />
          </Link>
        </div>
        <div className="col-start-3 flex justify-end items-center">
          <div className="flex gap-2">
            <Button
              variant="light"
              size="sm"
              onClick={() => changeLanguage("en")}
              className={`text-white px-2 w-max min-w-max ${i18n.language === "en" ? "font-bold" : ""}`}
            >
              Eng
            </Button>
            <Button
              variant="light"
              size="sm"
              onClick={() => changeLanguage("hy")}
              className={`text-white px-2 w-max min-w-max ${i18n.language === "hy" ? "font-bold" : ""}`}
            >
              Հայ
            </Button>
            <Button
              variant="light"
              size="sm"
              onClick={() => changeLanguage("ru")}
              className={`text-white px-2 w-max min-w-max ${i18n.language === "ru" ? "font-bold" : ""}`}
            >
              Рус
            </Button>
          </div>
        </div>
        <div className="col-start-2 flex items-center justify-center">
          <Tabs
            variant="underlined"
            defaultSelectedKey={"teachers"}
            classNames={{
              tabContent:
                "text-white group-data-[selected=true]:text-white group-data-[selected=true]:font-semibold",
              cursor: "bg-white",
            }}
            onSelectionChange={(key) => {
              navigate({ to: `/${key}` });
            }}
          >
            <Tab
              title={t("TEACHERS")}
              key={"teachers"}
              className="text-white"
            />
            <Tab title={t("DONORS")} key={"donors"} className="text-white" />
            <Tab title={t("ABOUT_US")} key={"about"} className="text-white" />
            <Tab
              title={t("CONTACT_US")}
              key={"contact"}
              className="text-white"
            />
            <Tab title={t("BLOG")} key={"blog"} className="text-white" />
          </Tabs>
        </div>
        <div className="col-start-3 flex justify-end items-center">
          {isAuthenticated ? (
            <Button
              onClick={() => {
                signOut();
                setIsDrawerOpen(false);
              }}
              variant="light"
              className="flex items-center font-bold text-white hover:text-gray-200"
            >
              <Icon icon="tabler:logout" className="mr-2" />
              {t("SIGN_OUT")}
            </Button>
          ) : (
            <Link
              to="/sign-in"
              className="flex items-center text-white hover:text-gray-200"
            >
              <Icon icon="tabler:login-2" className="mr-2" />
              {t("SIGN_IN")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
