"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Target, Trophy, Wind, Crosshair, XCircle, AlertCircle, Clock, Crosshair as CrosshairIcon, Copy, CheckCircle } from 'lucide-react';

// --- Игровой Движок (Восстановлен в полном объеме из Tir.txt) ---
class GameEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private callbacks: any;
    private width: number = 0;
    private height: number = 0;
    private centerX: number = 0;
    private centerY: number = 0;
    private isPlaying: boolean = false;
    private isEnding: boolean = false;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private scopeSwayX: number = 0;
    private scopeSwayY: number = 0;
    private recoilY: number = 0;
    private windSpeed: number = 0;
    private isHoldingBreath: boolean = false;
    private breathStamina: number = 100;
    private breathRecoveryTimer: number = 0;
    private score: number = 0;
    private maxCashback: number = 0;
    private timeLeft: number = 30;
    private ammo: number = 10;
    private lastReportedTime: number = 30;
    private targets: any[] = [];
    private bulletTrails: any[] = [];
    private particles: any[] = [];
    private landscapeLayers: any[] = [];
    private lastTime: number = 0;
    private animationFrameId: number | null = null;
    private audioCtx: AudioContext | null = null;

    constructor(canvas: HTMLCanvasElement, callbacks: any) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not get context");
        this.ctx = context;
        this.callbacks = callbacks;
        
        this.resize = this.resize.bind(this);
        this.loop = this.loop.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.initWindInterval();
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playSound(type: string) {
        if (!this.audioCtx) return;
        const t = this.audioCtx.currentTime;
        
        if (type === 'shoot') {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);
            gain.gain.setValueAtTime(1, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.5);

            const bufferSize = this.audioCtx.sampleRate * 0.5;
            const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = this.audioCtx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000;
            const noiseGain = this.audioCtx.createGain();
            noiseGain.gain.setValueAtTime(1.5, t);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.audioCtx.destination);
            noise.start(t);
        } else if (type === 'hit') {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1200, t);
            osc.frequency.exponentialRampToValueAtTime(400, t + 0.4);
            gain.gain.setValueAtTime(1, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.4);
        } else if (type === 'empty') {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.1);
        }
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.mouseX = this.centerX;
        this.mouseY = this.centerY;
        this.generateLandscape();
    }

    generateLandscape() {
        this.landscapeLayers = [];
        for (let i = 0; i < 4; i++) {
            let points = [];
            let yOffset = this.height * 0.4 + (i * this.height * 0.15);
            let roughness = 150 - (i * 30);
            for (let x = -1000; x < this.width + 1000; x += 100) {
                let y = yOffset + Math.sin(x / roughness) * (50 + i * 20) + Math.cos(x / (roughness * 1.5)) * 30;
                points.push({x, y});
            }
            let color = ['#1a202c', '#2d3748', '#4a5568', '#2b2a27'][i];
            this.landscapeLayers.push({ points, color, speed: 0.1 + (i * 0.2) });
        }
    }

    spawnTarget() {
        const rand = Math.random();
        let cashback = 1;
        let dist = 200;
        let speedMult = 0;

        if (rand > 0.98) {
            cashback = 15; dist = 1000 + Math.random() * 200; speedMult = 3.5;
        } else if (rand > 0.90) {
            cashback = 10; dist = 800 + Math.random() * 200; speedMult = 2.5;
        } else if (rand > 0.70) {
            cashback = 5; dist = 600 + Math.random() * 200; speedMult = 1.5;
        } else if (rand > 0.40) {
            cashback = 3; dist = 400 + Math.random() * 200; speedMult = 1;
        } else {
            cashback = 1; dist = 200 + Math.random() * 200; speedMult = 0;
        }

        const scale = 500 / dist;
        const x = this.width * 0.2 + Math.random() * (this.width * 0.6);
        const y = this.height * 0.5 + Math.random() * (this.height * 0.3);

        this.targets.push({
            x, y, dist, scale,
            radius: 20 * scale,
            cashback,
            active: true,
            vx: (Math.random() > 0.5 ? 1 : -1) * speedMult * scale,
            timer: 0
        });
    }

    initWindInterval() {
        setInterval(() => {
            if (!this.isPlaying || this.isEnding) return;
            this.windSpeed += (Math.random() - 0.5) * 3;
            this.windSpeed = Math.max(-15, Math.min(15, this.windSpeed));
            this.callbacks.onWindChange(this.windSpeed);
        }, 4000);
    }

    start() {
        this.isPlaying = true;
        this.isEnding = false;
        this.score = 0;
        this.maxCashback = 0;
        this.timeLeft = 30;
        this.ammo = 10;
        this.lastReportedTime = 30;
        
        this.callbacks.onTimeUpdate(this.timeLeft);
        this.callbacks.onAmmoUpdate(this.ammo);

        this.resize();
        this.initAudio();
        this.targets = [];
        for(let i=0; i<4; i++) this.spawnTarget();
        this.callbacks.onWindChange(this.windSpeed);
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    stop() {
        this.isPlaying = false;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }

    handleMouseMove(e: MouseEvent) {
        if (!this.isPlaying || this.isEnding) return;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    handleMouseDown(e: MouseEvent) {
        if (!this.isPlaying || e.button !== 0 || this.isEnding) return;
        this.fire();
    }

    handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Shift' && this.breathStamina > 0 && this.breathRecoveryTimer === 0) {
            this.isHoldingBreath = true;
        }
    }

    handleKeyUp(e: KeyboardEvent) {
        if (e.key === 'Shift') this.isHoldingBreath = false;
    }

    fire() {
        if (this.ammo <= 0) {
            this.playSound('empty');
            return;
        }

        this.ammo--;
        this.callbacks.onAmmoUpdate(this.ammo);
        
        this.playSound('shoot');
        this.recoilY = 180;
        
        const aimX = this.mouseX + this.scopeSwayX;
        const aimY = this.mouseY + this.scopeSwayY;

        let hitTarget: any = null;
        let hitData: any = null;

        for (let i = this.targets.length - 1; i >= 0; i--) {
            const t = this.targets[i];
            if (!t.active) continue;

            const windDeflection = this.windSpeed * (t.dist / 100) * 2;
            const bulletDrop = 9.81 * Math.pow(t.dist / 200, 2); 

            const actualHitX = aimX + windDeflection;
            const actualHitY = aimY + bulletDrop;

            const dx = actualHitX - t.x;
            const dy = actualHitY - t.y;
            const distanceToCenter = Math.sqrt(dx*dx + dy*dy);

            if (distanceToCenter <= t.radius) {
                hitTarget = t;
                hitData = { hitX: actualHitX, hitY: actualHitY, dist: t.dist };
                break;
            } else {
                hitData = { hitX: actualHitX, hitY: actualHitY, dist: t.dist, miss: true };
            }
        }

        const travelTimeMs = hitData ? (hitData.dist / 800) * 1000 : 200;

        this.bulletTrails.push({
            startX: aimX, startY: aimY, 
            endX: hitData ? hitData.hitX : aimX + (Math.random()-0.5)*100,
            endY: hitData ? hitData.hitY : aimY + 200,
            life: 1.0
        });

        setTimeout(() => {
            if (hitTarget && hitTarget.active) {
                this.playSound('hit');
                hitTarget.active = false;
                this.score += hitTarget.cashback * 50; 
                
                if (hitTarget.cashback > this.maxCashback) {
                    this.maxCashback = hitTarget.cashback;
                }

                this.callbacks.onScoreUpdate(this.score, this.maxCashback);
                this.callbacks.onHitMessage(`КЭШБЕК ${hitTarget.cashback}% !`, hitTarget.cashback >= 10);
                this.spawnParticles(hitData.hitX, hitData.hitY, '#fbbf24', 30); 
            } else if (hitData && hitData.miss) {
                this.spawnParticles(hitData.hitX, hitData.hitY, '#8b7355', 10); 
            }

            if (this.ammo <= 0 && !this.isEnding) {
                this.triggerGameOver();
            }
        }, travelTimeMs);
    }

    triggerGameOver() {
        if (this.isEnding) return;
        this.isEnding = true;
        setTimeout(() => {
            this.callbacks.onGameOver(this.score, this.maxCashback);
        }, 1500);
    }

    spawnParticles(x: number, y: number, color: string, count: number) {
        for(let i=0; i<count; i++){
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                life: 1.0,
                color
            });
        }
    }

    loop(timestamp: number) {
        if (!this.isPlaying) return;
        const dt = (timestamp - this.lastTime) / 1000 || 0;
        this.lastTime = timestamp;

        this.updateMechanics(dt, timestamp);
        this.drawFrame();

        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    updateMechanics(dt: number, timestamp: number) {
        if (this.isEnding) return;

        if (this.timeLeft > 0) {
            this.timeLeft -= dt;
            const currentCeilTime = Math.max(0, Math.ceil(this.timeLeft));
            if (currentCeilTime !== this.lastReportedTime) {
                this.lastReportedTime = currentCeilTime;
                this.callbacks.onTimeUpdate(currentCeilTime);
            }
            if (this.timeLeft <= 0) {
                this.triggerGameOver();
            }
        }

        let breathMultiplier = 1.0;

        if (this.isHoldingBreath) {
            this.breathStamina -= dt * 25;
            breathMultiplier = 0.1; 
            if (this.breathStamina <= 0) {
                this.isHoldingBreath = false;
                this.breathRecoveryTimer = 3.0;
            }
        } else {
            if (this.breathRecoveryTimer > 0) {
                this.breathRecoveryTimer -= dt;
                breathMultiplier = 3.0; 
            } else {
                this.breathStamina += dt * 15;
            }
        }
        this.breathStamina = Math.max(0, Math.min(100, this.breathStamina));
        this.callbacks.onBreathUpdate(this.breathStamina, this.isHoldingBreath, this.breathRecoveryTimer > 0);

        const timeStr = timestamp * 0.001;
        this.scopeSwayX = Math.sin(timeStr * 1.3) * 15 * breathMultiplier + Math.sin(timeStr * 0.7) * 5 * breathMultiplier;
        this.scopeSwayY = Math.cos(timeStr * 1.1) * 20 * breathMultiplier + Math.cos(timeStr * 0.5) * 8 * breathMultiplier;

        this.recoilY = this.recoilY * 0.85; 

        this.targets.forEach(t => {
            if (!t.active) return;
            t.x += t.vx;
            if (t.x < this.width * 0.1 || t.x > this.width * 0.9) t.vx *= -1;
        });

        this.targets = this.targets.filter(t => t.active);
        if (this.targets.length < 5 && Math.random() < 0.03) {
            this.spawnTarget();
        }

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 9.8 * dt;
            p.life -= dt;
        });
        this.particles = this.particles.filter(p => p.life > 0);

        this.bulletTrails.forEach(b => { b.life -= dt * 3; });
        this.bulletTrails = this.bulletTrails.filter(b => b.life > 0);
    }

    drawFrame() {
        const { ctx, width, height, centerX, centerY, mouseX, mouseY } = this;

        // Sky
        const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#0f172a');
        skyGradient.addColorStop(1, '#450a0a');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, width, height);

        const parallaxOffsetX = (mouseX - centerX) * -0.05;
        const parallaxOffsetY = (mouseY - centerY) * -0.05;

        // --- ДЕКОРАЦИЯ: Krak.am в небе ---
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#fbbf24';
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 12vw "Arial Black", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Krak.am', width * 0.5 + parallaxOffsetX * 0.02, height * 0.3 + parallaxOffsetY * 0.02);
        ctx.restore();

        // Landscape
        this.landscapeLayers.forEach((layer, index) => {
            ctx.fillStyle = layer.color;
            ctx.beginPath();
            ctx.moveTo(0, height);
            let pOffset = parallaxOffsetX * layer.speed;
            layer.points.forEach((p, idx) => {
                if (idx === 0) ctx.lineTo(p.x + pOffset, p.y + parallaxOffsetY);
                else ctx.lineTo(p.x + pOffset, p.y + parallaxOffsetY);
            });
            ctx.lineTo(width + 1000, height);
            ctx.fill();

            // --- ДЕКОРАЦИЯ: Магазин EGER ---
            if (index === 1) {
                const shopX = width * 0.75 + pOffset;
                const shopY = height * 0.6 + parallaxOffsetY;
                ctx.fillStyle = '#1e1b4b'; 
                ctx.fillRect(shopX - 120, shopY - 100, 240, 150);
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.moveTo(shopX - 140, shopY - 100);
                ctx.lineTo(shopX, shopY - 150);
                ctx.lineTo(shopX + 140, shopY - 100);
                ctx.fill();
                ctx.fillStyle = '#fde047'; 
                ctx.fillRect(shopX - 80, shopY - 30, 40, 60);
                ctx.fillRect(shopX + 40, shopY - 30, 40, 60);
                ctx.fillStyle = '#020617';
                ctx.fillRect(shopX - 20, shopY - 40, 40, 90);
                ctx.fillStyle = '#000';
                ctx.fillRect(shopX - 100, shopY - 90, 200, 45);
                ctx.strokeStyle = '#ef4444'; 
                ctx.lineWidth = 2;
                ctx.strokeRect(shopX - 100, shopY - 90, 200, 45);
                ctx.fillStyle = '#ef4444'; 
                ctx.font = 'bold 28px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('EGER', shopX, shopY - 65);
                ctx.fillStyle = '#fca5a5';
                ctx.font = '10px monospace';
                ctx.fillText('ОРУЖЕЙНЫЙ МАГАЗИН', shopX, shopY - 52);
            }
        });

        // Targets
        this.targets.forEach(t => {
            if (!t.active) return;
            const drawX = t.x + parallaxOffsetX * 0.5;
            const drawY = t.y + parallaxOffsetY * 0.5;
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 4 * t.scale;
            ctx.beginPath();
            ctx.moveTo(drawX - t.radius*1.5, drawY - t.radius*1.5);
            ctx.lineTo(drawX + t.radius*1.5, drawY - t.radius*1.5);
            ctx.moveTo(drawX, drawY - t.radius*1.5);
            ctx.lineTo(drawX, drawY - t.radius);
            ctx.stroke();
            ctx.fillStyle = t.cashback >= 10 ? '#fbbf24' : '#e5e7eb';
            ctx.beginPath();
            ctx.arc(drawX, drawY, t.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#374151';
            ctx.lineWidth = 2 * t.scale;
            ctx.stroke();
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(drawX, drawY, t.radius * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = t.cashback >= 10 ? '#fbbf24' : 'rgba(255, 255, 255, 0.8)';
            ctx.font = `bold ${Math.max(12, 16 * t.scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(`${t.cashback}%`, drawX, drawY - t.radius * 2);
            ctx.font = `${Math.max(10, 12 * t.scale)}px monospace`;
            ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
            ctx.fillText(`${Math.floor(t.dist)}m`, drawX, drawY + t.radius * 2);
        });

        // Particles
        this.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x + parallaxOffsetX*0.5, p.y + parallaxOffsetY*0.5, 3, 0, Math.PI*2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // Trails
        ctx.lineWidth = 1.5;
        this.bulletTrails.forEach(b => {
            ctx.strokeStyle = `rgba(255, 255, 200, ${b.life * 0.6})`;
            ctx.beginPath();
            ctx.moveTo(b.startX, b.startY);
            ctx.lineTo(b.endX + parallaxOffsetX*0.5, b.endY + parallaxOffsetY*0.5);
            ctx.stroke();
        });

        // SCOPE
        const sx = mouseX;
        const sy = mouseY - this.recoilY;
        const scopeRadius = Math.min(width, height) * 0.4;
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.arc(sx, sy, scopeRadius, 0, Math.PI * 2, true); 
        ctx.fill();
        const glassGrad = ctx.createRadialGradient(sx, sy, scopeRadius*0.1, sx, sy, scopeRadius);
        glassGrad.addColorStop(0, 'rgba(0, 255, 50, 0.02)');
        glassGrad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
        ctx.fillStyle = glassGrad;
        ctx.beginPath();
        ctx.arc(sx, sy, scopeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.beginPath();
        ctx.arc(sx, sy, scopeRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy - scopeRadius);
        ctx.lineTo(sx, sy + scopeRadius);
        ctx.moveTo(sx - scopeRadius, sy);
        ctx.lineTo(sx + scopeRadius, sy);
        ctx.stroke();
        const milSpacing = scopeRadius / 10;
        ctx.lineWidth = 1.5;
        for (let i = -10; i <= 10; i++) {
            if (i === 0) continue;
            ctx.beginPath();
            ctx.moveTo(sx - 5, sy + i * milSpacing);
            ctx.lineTo(sx + 5, sy + i * milSpacing);
            ctx.stroke();
            if (i > 0 && i % 2 === 0) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.font = '12px monospace';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(i.toString(), sx + 10, sy + i * milSpacing);
            }
            ctx.beginPath();
            ctx.moveTo(sx + i * milSpacing, sy - 5);
            ctx.lineTo(sx + i * milSpacing, sy + 5);
            ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = '#050505';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.arc(sx, sy, scopeRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
        ctx.beginPath();
        ctx.arc(sx + this.scopeSwayX, sy + this.scopeSwayY, 3, 0, Math.PI*2);
        ctx.fill();
    }
}

// --- React Страница ---
export default function RangePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<GameEngine | null>(null);

    const [gameState, setGameState] = useState('menu'); 
    const [score, setScore] = useState(0);
    const [maxCashback, setMaxCashback] = useState(0);
    const [windSpeed, setWindSpeed] = useState(0);
    const [breath, setBreath] = useState(100);
    const [breathStatus, setBreathStatus] = useState('НОРМА');
    const [timeLeft, setTimeLeft] = useState(30);
    const [ammo, setAmmo] = useState(10);
    const [hitMessage, setHitMessage] = useState({ text: '', active: false });
    const [playerName, setPlayerName] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    // Добавь это внутрь function RangePage() { ... }

const fetchTop = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      
      // Проверка: если сервер ответил ошибкой, не пытаемся читать JSON
      if (!res.ok) {
          console.warn("API временно недоступно");
          return;
      }
  
      const data = await res.json();
      if (data && !data.error) {
          setLeaderboard(data);
      }
    } catch (err) {
      console.error("Ошибка загрузки ТОПа:", err);
    }
  };

    const handleGameOver = useCallback((s: number, cb: number) => {
        engineRef.current?.stop();
        setScore(s); setMaxCashback(cb);
        if (cb > 0) {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let res = `KRAK-${cb}-`;
            for(let i=0; i<5; i++) res += chars[Math.floor(Math.random()*chars.length)];
            setPromoCode(res);
        } else {
            setPromoCode('');
        }
        setGameState('gameover');
        fetchTop(); 
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
        engineRef.current = new GameEngine(canvasRef.current, {
            onScoreUpdate: setScore, onWindChange: setWindSpeed, onTimeUpdate: setTimeLeft, onAmmoUpdate: setAmmo, onGameOver: handleGameOver,
            onHitMessage: (t:string) => { setHitMessage({text:t, active:true}); setTimeout(()=>setHitMessage({text:'', active:false}), 1500); },
            onBreathUpdate: (s:number, h:boolean, e:boolean) => { setBreath(s); setBreathStatus(e?'ОТДЫШКА':(h?'ЗАДЕРЖКА':'НОРМА')); }
        });
        const e = engineRef.current;
        window.addEventListener('resize', e.resize);
        window.addEventListener('mousemove', (ev) => e.handleMouseMove(ev));
        window.addEventListener('mousedown', (ev) => e.handleMouseDown(ev));
        window.addEventListener('keydown', (ev) => e.handleKeyDown(ev));
        window.addEventListener('keyup', (ev) => e.handleKeyUp(ev));
        
        fetchTop(); 
    }, [handleGameOver]);

    const saveResult = async () => {
        if (!playerName) return alert("Введите позывной!");
        try {
            const res = await fetch('/api/leaderboard', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                name: playerName, 
                score, 
                cashback: maxCashback,
                promoCode: promoCode 
              })
            });
            if (res.ok) {
                setGameState('leaderboard');
                fetchTop(); 
            } else {
                alert("Ошибка сохранения");
            }
        } catch (e) {
            alert("Ошибка сети");
        }
    };

    const startGame = () => {
        setScore(0);
        setMaxCashback(0);
        setPromoCode('');
        setGameState('playing');
        engineRef.current?.start();
    };

    return (
        <div className="w-full h-screen overflow-hidden bg-black font-mono text-white relative select-none">
            <canvas ref={canvasRef} className={`block w-full h-full ${gameState==='playing'?'cursor-none':'cursor-default'}`} />
            
            {gameState === 'playing' && (
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="bg-black/60 p-4 border border-red-600/30 rounded backdrop-blur-md">
                            <div className="text-[10px] text-red-500 mb-1 uppercase font-black"><Wind size={12}/> ВЕТЕР</div>
                            <div className="text-3xl font-black text-red-600">{Math.abs(windSpeed).toFixed(1)} м/с</div>
                        </div>
                        <div className="bg-black/60 p-4 border border-blue-600/30 rounded text-center backdrop-blur-md">
                            <div className="text-[10px] text-blue-400 mb-1 uppercase font-black"><Clock size={12}/> ВРЕМЯ</div>
                            <div className="text-4xl font-black italic">00:{timeLeft<10?`0${timeLeft}`:timeLeft}</div>
                        </div>
                        <div className="bg-black/60 p-4 border border-yellow-600/30 rounded text-right backdrop-blur-md">
                            <div className="text-[10px] text-yellow-500 mb-1 uppercase font-black"><Trophy size={12}/> КЭШБЕК</div>
                            <div className="text-4xl font-black text-yellow-500">{maxCashback}%</div>
                        </div>
                    </div>
                    {hitMessage.active && <div className="absolute inset-0 flex items-center justify-center text-6xl font-black italic text-yellow-400 animate-pulse">{hitMessage.text}</div>}
                    <div className="bg-black/60 p-4 border border-red-600/30 rounded w-1/3 backdrop-blur-md">
                        <div className="flex justify-between text-[10px] mb-2 uppercase font-black"><span>КИСЛОРОД [SHIFT]</span><span className={breathStatus==='ОТДЫШКА'?'text-red-500':'text-green-400'}>{breathStatus}</span></div>
                        <div className="h-1.5 w-full bg-zinc-900 overflow-hidden rounded-full"><div className="h-full bg-red-600 transition-all duration-75" style={{width:`${breath}%`}}/></div>
                    </div>
                </div>
            )}

            {gameState === 'menu' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90">
                    <div className="text-center p-12 border-2 border-red-600 bg-zinc-950 shadow-2xl">
                        <CrosshairIcon size={80} className="mx-auto mb-6 text-red-600" />
                        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4 text-white font-sans">KRAK SNIPER</h1>
                        <button onClick={startGame} className="bg-red-600 hover:bg-white hover:text-black text-white px-16 py-5 font-black text-xl skew-x-[-10deg] transition-all uppercase italic">НАЧАТЬ ЗАДАНИЕ</button>
                    </div>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-xl">
                    <div className="max-w-md w-full p-10 border-2 border-yellow-600 bg-zinc-950 text-center">
                        <Trophy size={60} className="mx-auto mb-4 text-yellow-500" />
                        <h2 className="text-3xl font-black mb-6 uppercase text-yellow-500 italic tracking-tighter">РЕЗУЛЬТАТ: {score}</h2>
                        {promoCode && (
                            <div className="mb-8 p-4 bg-yellow-600/10 border-2 border-dashed border-yellow-600/50">
                                <p className="text-[10px] text-yellow-500 mb-2 font-bold uppercase tracking-widest font-sans">ПРОМОКОД НА {maxCashback}% КЭШБЕК</p>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-2xl font-black tracking-wider text-white">{promoCode}</span>
                                    <button onClick={() => {navigator.clipboard.writeText(promoCode); alert("Скопировано!");}} className="text-yellow-500 hover:text-white transition-colors"><Copy size={20}/></button>
                                </div>
                            </div>
                        )}
                        <input autoFocus placeholder="ВАШ ПОЗЫВНОЙ..." className="w-full bg-zinc-900 border border-zinc-700 p-4 text-center font-bold uppercase outline-none focus:border-yellow-500 mb-4 text-white" value={playerName} onChange={e=>setPlayerName(e.target.value)} />
                        <button onClick={saveResult} className="w-full bg-yellow-600 py-4 font-black transition-all uppercase italic tracking-widest skew-x-[-5deg]">СОХРАНИТЬ В ТАБЛИЦЕ</button>
                    </div>
                </div>
            )}

            {gameState === 'leaderboard' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/95">
                    <div className="max-w-2xl w-full p-8 border-2 border-zinc-800 bg-zinc-950 shadow-2xl">
                        <h2 className="text-4xl font-black italic uppercase text-yellow-500 mb-8 text-center tracking-tighter flex items-center justify-center gap-4"><Trophy size={32}/> ЗАЛ СЛАВЫ</h2>
                        <div className="bg-zinc-900/50 border border-zinc-800 max-h-[400px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left uppercase text-xs font-bold font-mono">
                                <thead className="bg-zinc-900 sticky top-0 text-zinc-500 border-b border-zinc-800">
                                    <tr><th className="p-4">РАНГ</th><th className="p-4">СТРЕЛОК</th><th className="p-4 text-right">ОЧКИ</th><th className="p-4 text-right">КБ</th></tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((u, i) => (
                                        <tr key={i} className={`border-b border-zinc-900 ${u.name === playerName ? 'bg-yellow-900/20 text-yellow-400 font-black' : 'text-zinc-400'}`}>
                                            <td className="p-4">#{i+1}</td>
                                            <td className="p-4 italic">{u.name}</td>
                                            <td className="p-4 text-right">{u.score.toLocaleString()}</td>
                                            <td className="p-4 text-right text-yellow-500">{u.cashback}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => setGameState('menu')} className="w-full mt-8 bg-zinc-800 py-4 font-black skew-x-[-5deg] hover:bg-zinc-700 transition-all uppercase italic text-sm tracking-widest">ВЕРНУТЬСЯ В МЕНЮ</button>
                    </div>
                </div>
            )}
        </div>
    );
}