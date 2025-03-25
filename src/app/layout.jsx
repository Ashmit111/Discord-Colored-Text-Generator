  import '@mantine/core/styles.css';
import '@mantine/code-highlight/styles.css';
import './globals.css';
import { MantineProvider, createTheme, ColorSchemeScript } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'sm',
  colors: {
    discord: ['#7289DA', '#7289DA', '#7289DA', '#7289DA', '#5865F2', '#5865F2', '#5865F2', '#7289DA', '#7289DA', '#7289DA'],
  },
});

export const metadata = {
  title: `Ashmit's Discord Colored Text Generator`,
  description: 'Generate colored text for Discord messages using ANSI codes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-mantine-color-scheme="light">
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
