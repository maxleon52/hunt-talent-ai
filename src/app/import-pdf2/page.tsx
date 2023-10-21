import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

import PdfReader from "@/components/PdfReader";

export default function Home() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify(new JSDOM("<!DOCTYPE html>").window).sanitize(
          `${() => <PdfReader />}`,
        ),
      }}
    />
  );
}
