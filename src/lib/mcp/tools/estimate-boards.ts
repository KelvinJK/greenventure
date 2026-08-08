import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";

/** Standard stock piece: 3 m long. */
const BOARD_LENGTH_M = 3;

export default defineTool({
  name: "estimate_boards_needed",
  title: "Estimate boards needed",
  description:
    "Estimate how many 3 m recycled-plastic boards are needed to cover an area, from the area in square metres (or width x length) and the board width, plus an allowance for gaps and waste.",
  inputSchema: {
    areaSqm: z.number().optional().describe("Area to cover in square metres."),
    widthM: z.number().optional().describe("Space width in metres (used with lengthM)."),
    lengthM: z.number().optional().describe("Space length in metres (used with widthM)."),
    boardWidthMm: z
      .number()
      .optional()
      .describe("Board width in millimetres. Defaults to 152.4 mm (6 inch)."),
    gapMm: z.number().optional().describe("Gap between boards in millimetres. Defaults to 5."),
    wastePercent: z.number().optional().describe("Waste allowance percentage. Defaults to 10."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ areaSqm, widthM, lengthM, boardWidthMm, gapMm, wastePercent }) => {
    const area = areaSqm ?? (widthM && lengthM ? widthM * lengthM : 0);
    if (!(area > 0)) {
      throw new ToolError("Provide either areaSqm, or both widthM and lengthM, greater than zero.");
    }

    const boardWidth = boardWidthMm && boardWidthMm > 0 ? boardWidthMm : 152.4;
    const gap = gapMm && gapMm >= 0 ? gapMm : 5;
    const waste = Math.min(50, Math.max(0, wastePercent ?? 10)) / 100;

    const effectiveWidthM = (boardWidth + gap) / 1000;
    const coveragePerBoard = effectiveWidthM * BOARD_LENGTH_M;
    const boards = Math.ceil((area * (1 + waste)) / coveragePerBoard);
    const linearMeters = boards * BOARD_LENGTH_M;

    const summary =
      `Area: ${area.toFixed(2)} m2. Board: ${boardWidth} mm wide x ${BOARD_LENGTH_M} m ` +
      `with ${gap} mm gaps covers ${coveragePerBoard.toFixed(3)} m2 each. ` +
      `With ${Math.round(waste * 100)}% waste you need ${boards} boards (${linearMeters} linear metres).`;

    return {
      content: [{ type: "text", text: summary }],
      structuredContent: {
        areaSqm: Number(area.toFixed(3)),
        boardWidthMm: boardWidth,
        gapMm: gap,
        wastePercent: Math.round(waste * 100),
        boardLengthM: BOARD_LENGTH_M,
        coveragePerBoardSqm: Number(coveragePerBoard.toFixed(4)),
        boards,
        linearMeters,
      },
    };
  },
});
