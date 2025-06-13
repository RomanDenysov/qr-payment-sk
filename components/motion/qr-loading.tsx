'use client';
import { useEffect, useRef } from 'react';

type Grid = { alive: boolean; opacity: number }[][];

interface QRLoadingProps {
  size?: number;
}

export function QRLoading({ size = 300 }: QRLoadingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    let animationFrameId: number;
    const cellSize = 4;
    const cols = Math.floor(size / cellSize);
    const rows = Math.floor(size / cellSize);
    const transitionSpeed = 0.15;

    let grid: Grid = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            alive: Math.random() > 0.85,
            opacity: Math.random() > 0.85 ? 0.4 : 0,
          }))
      );

    const countNeighbors = (grid: Grid, x: number, y: number): number => {
      let sum = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          const row = (x + i + rows) % rows;
          const col = (y + j + cols) % cols;
          sum += grid[row][col].alive ? 1 : 0;
        }
      }
      sum -= grid[x][y].alive ? 1 : 0;
      return sum;
    };

    const draw = () => {
      // Clear with white background to match QR code style
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Update opacities
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = grid[i][j];
          if (cell.alive && cell.opacity < 1) {
            cell.opacity = Math.min(cell.opacity + transitionSpeed, 0.4);
          } else if (!cell.alive && cell.opacity > 0) {
            cell.opacity = Math.max(cell.opacity - transitionSpeed, 0);
          }

          if (cell.opacity > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${cell.opacity})`;
            ctx.fillRect(
              j * cellSize,
              i * cellSize,
              cellSize - 1,
              cellSize - 1
            );
          }
        }
      }

      const next = grid.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = countNeighbors(grid, i, j);
          const willBeAlive = cell.alive
            ? neighbors >= 2 && neighbors <= 3
            : neighbors === 3;
          return {
            alive: willBeAlive,
            opacity: cell.opacity,
          };
        })
      );

      grid = next;
      setTimeout(() => {
        animationFrameId = requestAnimationFrame(draw);
      }, 150);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-lg border bg-white"
      />
    </div>
  );
} 