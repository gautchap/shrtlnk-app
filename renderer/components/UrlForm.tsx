import { FormEvent } from "react";

interface Props {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const UrlForm = ({ handleSubmit }: Props) => {
    return (
        <form onSubmit={handleSubmit} className="m-auto">
            <div className="form-control py-2">
                <label htmlFor="longUrl" className="label">
                    <span className="label-text">Mettez ici le lien que vous voulez raccourcir</span>
                </label>
                <input
                    type="text"
                    name="longUrl"
                    id="longUrl"
                    placeholder="http://mon-lien-super-mega-long.com/encore-plus-long"
                    className="input input-bordered w-full"
                />
            </div>

            <div className="form-control py-2">
                <label htmlFor="shortUrl" className="label">
                    <span className="label-text">Le domaine</span>
                    <span className="label-text">nom de lien personalisé (optionnel)</span>
                </label>

                <div className="flex">
                    <input
                        type="text"
                        placeholder={`${import.meta.env.VITE_APP_DOMAIN}/`}
                        className="input input-bordered w-[45%]"
                        disabled
                    />
                    <input
                        type="text"
                        placeholder="ex: fav-link"
                        id="shortUrl"
                        name="shortUrl"
                        className="input input-bordered  w-[60%]"
                    />
                </div>
            </div>

            <div className="card-actions justify-end py-2">
                <button className="btn btn-primary" type="submit">
                    Envoyer !
                </button>
            </div>
        </form>
    );
};

export default UrlForm;
