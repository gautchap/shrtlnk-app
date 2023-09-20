import { QRCode } from "react-qrcode-logo";

interface Props {
  url: string;
}

const QrCode = ({ url }: Props) => {
  return (
    <div className="m-auto">
      <QRCode
        value={url}
        eyeRadius={5}
        size={200}
        logoImage={"/assets/logo.svg"}
        removeQrCodeBehindLogo={true}
        logoPadding={10}
        ecLevel={"Q"}
      />
    </div>
  );
};

export default QrCode;
