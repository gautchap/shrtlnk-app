import { FormEvent, ReactElement, useState } from "react";
import { createCustomUrl, createUrl, url } from "../../renderer/fetcher";
import { toastError, toastSuccess } from "../../renderer/components/toast";
import { TabList } from "../../renderer/components/tabs";
import UrlForm from "../../renderer/components/UrlForm";
import QrCode from "../../renderer/components/QrCode";
import { z } from "zod";

const UrlSchema = z.string().url();

export { Page };

function Page() {
    const [shortUrl, setShortUrl] = useState("");
    const [activeTab, setActiveTab] = useState(1);
    const [errorMessage, setErrorMessage] = useState<ReactElement>();
    const [successMessage, setSuccessMessage] = useState<ReactElement>();

    const handleError = (text: string) => {
        setErrorMessage(toastError(text));
        setTimeout(() => {
            setErrorMessage(<></>);
        }, 3000);
        return;
    };

    const handleSuccess = (text: string) => {
        setSuccessMessage(toastSuccess(text));
        setTimeout(() => {
            setSuccessMessage(<></>);
        }, 3000);
        return;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(<></>);

        const form = event.currentTarget;
        const formData = new FormData(form);

        const longUrlInput = formData.get("longUrl");
        const shortUrlInput = formData.get("shortUrl");

        if (typeof longUrlInput === "string" && longUrlInput.trim() === "") {
            return handleError("le champ est vide");
        }

        if (
            typeof longUrlInput === "string" &&
            longUrlInput.trim() !== "" &&
            !UrlSchema.safeParse(longUrlInput).success
        ) {
            return handleError("Veuillez entrer une URL valide !");
        }

        if (
            typeof shortUrlInput === "string" &&
            shortUrlInput.trim() !== "" &&
            typeof longUrlInput === "string" &&
            longUrlInput.trim() !== ""
        ) {
            try {
                const { shortUrl } = await createCustomUrl({
                    longUrl: longUrlInput,
                    shortUrl: shortUrlInput,
                });
                handleSuccess("Votre lien vient d'être créé");
                form.reset();
                return setShortUrl(shortUrl);
            } catch (error: any) {
                handleError(error.message);
            }
        }

        if (typeof longUrlInput === "string" && longUrlInput.trim() !== "") {
            const url = await createUrl({ longUrl: longUrlInput });
            handleSuccess("Votre lien vient d'être créé");
            form.reset();
            return setShortUrl(url.shortUrl);
        }
    };

    return (
        <>
            {errorMessage}
            {successMessage}
            <div className="w-[90%] absolute -translate-y-1/2 -translate-x-1/2 top-2/4 left-2/4 max-w-md ">
                <TabList activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className=" card bg-base-100 p-4 border shadow-xl min-h-[25em]">
                    {shortUrl.length > 0 ? (
                        <div className="alert alert-success">
                            <span>
                                Votre lien est prêt :{" "}
                                <div
                                    className="tooltip tooltip-open cursor-pointer"
                                    data-tip="Copié !"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${url}/${shortUrl}`);
                                    }}
                                >
                                    {import.meta.env.VITE_APP_DOMAIN}/{shortUrl}
                                </div>
                            </span>
                        </div>
                    ) : (
                        false
                    )}

                    {activeTab === 1 ? <UrlForm handleSubmit={handleSubmit} /> : false}
                    {activeTab === 2 ? <QrCode url={`${url}/${shortUrl}`} /> : false}
                </div>
            </div>
        </>
    );
}
