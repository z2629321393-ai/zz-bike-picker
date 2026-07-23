import { TYPE_LABELS, budgetLabel, labelFor } from './config.js';

export async function renderResultPoster(canvas, result, logoUrl) {
  const width = 900;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#fff2dc');
  gradient.addColorStop(0.48, '#f6b16e');
  gradient.addColorStop(1, '#a85e83');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(16,27,44,.12)';
  ctx.beginPath();
  ctx.arc(760, 120, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(70, 1110, 310, 0, Math.PI * 2);
  ctx.fill();

  roundRect(ctx, 55, 55, 790, 1090, 42);
  ctx.fillStyle = '#fffdf9';
  ctx.fill();
  ctx.strokeStyle = '#101b2c';
  ctx.lineWidth = 7;
  ctx.stroke();

  const logo = await loadImage(logoUrl).catch(() => null);
  if (logo) {
    roundRect(ctx, 95, 90, 96, 96, 24);
    ctx.save();
    ctx.clip();
    ctx.drawImage(logo, 95, 90, 96, 96);
    ctx.restore();
  }

  ctx.fillStyle = '#101b2c';
  ctx.font = '900 34px system-ui, sans-serif';
  ctx.fillText('骑不快的ZZ', 215, 130);
  ctx.font = '700 22px system-ui, sans-serif';
  ctx.fillStyle = '#667085';
  ctx.fillText('选车与装备建议 · V6.5.2', 215, 169);

  pill(ctx, 645, 95, 150, 52, '#101b2c', '#ffffff', '选车结论');

  ctx.fillStyle = '#ff8f4e';
  ctx.font = '900 28px system-ui, sans-serif';
  ctx.fillText('你的选车人格', 95, 260);

  ctx.fillStyle = '#101b2c';
  ctx.font = '1000 66px system-ui, sans-serif';
  drawWrappedText(ctx, TYPE_LABELS[result.primary].name, 95, 340, 700, 78, 2);

  ctx.fillStyle = '#41516a';
  ctx.font = '700 27px system-ui, sans-serif';
  drawWrappedText(ctx, TYPE_LABELS[result.primary].tone, 95, 440, 690, 40, 2);

  const traits = [
    labelFor('usage', result.answers.usage),
    budgetLabel(result.answers.budget),
    `${result.answers.height}cm`,
    labelFor('experience', result.answers.experience)
  ];
  let x = 95;
  let y = 530;
  for (const trait of traits) {
    const pillWidth = Math.max(120, ctx.measureText(trait).width + 46);
    if (x + pillWidth > 800) {
      x = 95;
      y += 64;
    }
    pill(ctx, x, y, pillWidth, 48, '#edf2f7', '#243a57', trait);
    x += pillWidth + 12;
  }

  ctx.fillStyle = '#101b2c';
  ctx.font = '900 28px system-ui, sans-serif';
  ctx.fillText('优先试坐', 95, 685);

  const recs = result.recommendations.slice(0, 3);
  if (recs.length) {
    recs.forEach((item, index) => {
      const top = 735 + index * 112;
      ctx.fillStyle = '#f5f7fa';
      roundRect(ctx, 95, top, 700, 86, 18);
      ctx.fill();
      ctx.fillStyle = '#ff9654';
      ctx.font = '900 26px system-ui, sans-serif';
      ctx.fillText(String(index + 1).padStart(2, '0'), 118, top + 52);
      ctx.fillStyle = '#101b2c';
      ctx.font = '900 25px system-ui, sans-serif';
      drawWrappedText(ctx, `${item.vehicle.brand} ${item.vehicle.model}`, 175, top + 37, 580, 31, 2);
    });
  } else {
    ctx.fillStyle = '#41516a';
    ctx.font = '700 26px system-ui, sans-serif';
    drawWrappedText(ctx, '当前车型库没有足够可靠的精确匹配，先按车型方向试坐。', 95, 750, 690, 38, 3);
  }

  ctx.fillStyle = '#101b2c';
  ctx.font = '900 25px system-ui, sans-serif';
  ctx.fillText('ZZ现实提醒', 95, 1080);
  ctx.fillStyle = '#5a6473';
  ctx.font = '700 21px system-ui, sans-serif';
  drawWrappedText(ctx, '别只问哪台车最好。用途、预算和你愿意承担的代价，比参数表更重要。', 95, 1115, 700, 30, 2);

  return canvas;
}

export function downloadCanvas(canvas, filename = '骑不快的ZZ-选车测试结果.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function pill(ctx, x, y, width, height, background, color, text) {
  ctx.fillStyle = background;
  roundRect(ctx, x, y, width, height, height / 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = '900 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + width / 2, y + height / 2 + 1);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const chars = [...String(text || '')];
  let line = '';
  let lineIndex = 0;
  for (let index = 0; index < chars.length; index += 1) {
    const test = line + chars[index];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineIndex * lineHeight);
      line = chars[index];
      lineIndex += 1;
      if (lineIndex >= maxLines - 1) {
        const rest = chars.slice(index + 1).join('');
        let finalLine = line + rest;
        while (ctx.measureText(`${finalLine}…`).width > maxWidth && finalLine.length > 1) finalLine = finalLine.slice(0, -1);
        ctx.fillText(`${finalLine}…`, x, y + lineIndex * lineHeight);
        return;
      }
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y + lineIndex * lineHeight);
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}
