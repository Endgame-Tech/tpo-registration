// import { useState } from 'react';
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = ({ text }: { text: string }) => {
  return <QRCodeCanvas value={text} bgColor="#00000000" fgColor="#096F30" size={80}/>;
};

export default QRCodeGenerator;
