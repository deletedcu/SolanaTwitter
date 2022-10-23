import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            property="og:url"
            content="https://solanatwitter.netlify.app"
            key="ogurl"
          />
          <meta property="og:title" content="Solana Twitter" key="ogtitle" />
          <meta
            property="og:site_name"
            content="Solana Twitter"
            key="ogsitename"
          />
          <meta
            property="og:description"
            content="Solana dApp like Twitter"
            key="ogdesc"
          />
          <meta
            property="og:image"
            content="https://solanatwitter.netlify.app/page.png"
            key="ogimage"
          />
          <meta property="og:type" content="article" key="ogtype" />
          <meta
            name="twitter:card"
            content="summary_large_image"
            key="twcard"
          />
          <meta name="twitter:site" content="Solana Twitter" key="twsite" />
          <meta
            property="tw:image"
            content="https://solanatwitter.netlify.app/page.png"
            key="twimage"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
