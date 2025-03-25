'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Paper,
  Stack,
  Tooltip,
  Box,
  CopyButton,
  rem,
  ActionIcon,
  Anchor,
  Flex
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

// Map of ANSI color codes to their descriptions
const colorDescriptions = {
  // FG
  "30": "Dark Gray (33%)",
  "31": "Red",
  "32": "Yellowish Green",
  "33": "Gold",
  "34": "Light Blue",
  "35": "Pink",
  "36": "Teal",
  "37": "White",
  // BG
  "40": "Blueish Black",
  "41": "Rust Brown",
  "42": "Gray (40%)",
  "43": "Gray (45%)",
  "44": "Light Gray (55%)",
  "45": "Blurple",
  "46": "Light Gray (60%)",
  "47": "Cream White",
};

export default function DiscordColoredTextGenerator() {
  const textareaRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [copyCount, setCopyCount] = useState(0);

  // Set initial content only once
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.innerHTML = `Welcome to <span class="ansi-33">Ashmit</span>'s <span class="ansi-45"><span class="ansi-37">Discord</span></span> <span class="ansi-31">C</span><span class="ansi-32">o</span><span class="ansi-33">l</span><span class="ansi-34">o</span><span class="ansi-35">r</span><span class="ansi-36">e</span><span class="ansi-37">d</span> Text Generator!`;
    }
  }, []);

  // Apply text formatting
  const applyFormatting = (formatCode) => {
    if (!textareaRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const selectionContents = range.extractContents();

    if (formatCode === 0) {
      // Reset formatting
      const textNode = document.createTextNode(selectionContents.textContent || '');
      range.insertNode(textNode);
      range.selectNodeContents(textNode);
    } else {
      // Apply specific formatting
      const span = document.createElement('span');
      span.classList.add(`ansi-${formatCode}`);
      span.appendChild(selectionContents);
      range.insertNode(span);
      range.selectNodeContents(span);
    }

    // Update selection
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // Generate Discord formatted text
  const generateFormattedText = () => {
    if (!textareaRef.current) return '';

    const htmlToAnsi = (html) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const traverse = (node, states = [{ fg: 0, bg: 0, st: 0 }]) => {
        let result = '';

        for (const child of Array.from(node.childNodes)) {
          if (child.nodeType === 3) { // Text node
            result += child.textContent;
          } else if (child.nodeName === 'BR') {
            result += '\n';
          } else if (child.nodeType === 1) { // Element node
            const element = child;
            const classes = Array.from(element.classList || []);

            // Find ANSI class
            const ansiClass = classes.find(cls => cls.startsWith('ansi-'));
            if (ansiClass) {
              const ansiCode = parseInt(ansiClass.split('-')[1]);
              const newState = { ...states[states.length - 1] };

              if (ansiCode < 30) newState.st = ansiCode;
              else if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
              else if (ansiCode >= 40) newState.bg = ansiCode;

              states.push(newState);

              // Apply ANSI escape code
              result += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`;

              // Process children
              result += traverse(element, states);

              states.pop();
              result += '\x1b[0m';

              // Restore previous state if needed
              if (states[states.length - 1].fg !== 0) {
                result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].fg}m`;
              }
              if (states[states.length - 1].bg !== 0) {
                result += `\x1b[${states[states.length - 1].bg}m`;
              }
            } else {
              // Process children without formatting
              result += traverse(element, states);
            }
          }
        }

        return result;
      };

      return traverse(tempDiv);
    };

    const ansiText = htmlToAnsi(textareaRef.current.innerHTML);
    return "```ansi\n" + ansiText + "\n```";
  };

  // Handle copy button click
  const handleCopy = () => {
    const formatted = generateFormattedText();
    navigator.clipboard.writeText(formatted).catch(() => {
      alert("Copying failed. You can manually select and copy the text.");
    });

    const funnyCopyMessages = [
      "Copied!",
      "Double Copy!",
      "Triple Copy!",
      "Dominating!!",
      "Rampage!!",
      "Mega Copy!!",
      "Unstoppable!!",
      "Wicked Sick!!",
      "Monster Copy!!!",
      "GODLIKE!!!",
      "BEYOND GODLIKE!!!!"
    ];

    setCopyStatus(funnyCopyMessages[copyCount]);
    setCopyCount((prev) => Math.min(10, prev + 1));

    setTimeout(() => {
      setCopyStatus('');
    }, 2000);
  };

  return (
    <Container size="md" py="xl">
      <Stack spacing="lg">
        <Title order={1} align="center">
          Ashmit's Discord <span style={{ color: '#5865F2' }}>Colored</span> Text Generator
        </Title>

        <Title order={3} align="center">About</Title>

        <Text align="center">
          This is a simple app that creates colored Discord messages using the <br/> ANSI color codes available on the latest Discord desktop versions.
        </Text>

        <Text align="center">
          To use this, write your text, select parts of it and assign colors to them, <br/> then copy it using the button below, and send in a Discord message.
        </Text>

        <Title order={3} align="center">Source Code</Title>

        <Text align="center">
          This app runs entirely in your browser and the source code is freely <br/> available on <Anchor href='https://gist.github.com/rebane2001/07f2d8e80df053c70a1576d27eabe97c'>GitHub</Anchor>. Shout out to kkrypt0nn for <Anchor href='https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06'>this guide</Anchor>.
        </Text>

        <Title order={3} align="center">Create your text</Title>

        <Flex justify='center' gap={4}>
          <Button variant="default" onClick={() => applyFormatting(0)}>
            Reset All
          </Button>
          <Button variant="default" className="ansi-1" onClick={() => applyFormatting(1)}>
            Bold
          </Button>
          <Button variant="default" className="ansi-4" onClick={() => applyFormatting(4)}>
            Line
          </Button>
        </Flex>

        <Flex justify='center'>
          <Box>
            <Text weight={500} mb="xs">FG Colors</Text>
            <Flex gap={6} mb="md">
              {[30, 31, 32, 33, 34, 35, 36, 37].map((code) => (
                <Tooltip key={code} label={colorDescriptions[code.toString()]} color='green'>
                  <ActionIcon
                    className={`ansi-${code}-bg`}
                    size="lg"
                    onClick={() => applyFormatting(code)}
                  >
                    &nbsp;
                  </ActionIcon>
                </Tooltip>
              ))}
            </Flex>

            <Text weight={500} mb="xs">BG Colors</Text>
            <Flex gap={6} mb="md">
              {[40, 41, 42, 43, 44, 45, 46, 47].map((code) => (
                <Tooltip key={code} label={colorDescriptions[code.toString()]} color='green'>
                  <ActionIcon
                    className={`ansi-${code}`}
                    size="lg"
                    onClick={() => applyFormatting(code)}
                  >
                    &nbsp;
                  </ActionIcon>
                </Tooltip>
              ))}
            </Flex>
          </Box>
        </Flex>

        <Flex justify='center'>
          <Stack spacing="md">
            <Paper
              withBorder
              p="md"
              style={{
                backgroundColor: '#2F3136',
                color: '#B9BBBE',
                minHeight: '200px',
                minWidth: '650px',
              }}
            >
              <div
                ref={textareaRef}
                contentEditable
                suppressContentEditableWarning
                style={{
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.875rem',
                  lineHeight: '1.125rem',
                  outline: 'none',
                }}
              />
            </Paper>

            <Flex justify='center'>
              <Group position="center">
                <CopyButton value={generateFormattedText()} timeout={2000}>
                  {({ copied, copy }) => (
                    <Button
                      variant={copied ? 'filled' : 'default'}
                      color={copied ? 'green' : ''}
                      onClick={() => {
                        copy();
                        handleCopy();
                      }}
                      lefticon={
                        copied ? (
                          <IconCheck style={{ width: rem(16), height: rem(16) }} />
                        ) : (
                          <IconCopy style={{ width: rem(16), height: rem(16) }} />
                        )
                      }
                    >
                      {copied ? copyStatus || 'Copied!' : 'Copy text as Discord formatted'}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Flex>

            <Text size="sm" align="center">
              This is an unofficial tool, it is not made or endorsed by Discord.
            </Text>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
}
