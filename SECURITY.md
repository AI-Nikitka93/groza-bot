# Security Policy

## Supported Versions

Groza focuses on real-time safety, and maintaining a secure dependency chain is critical to our operational integrity. Only the latest major branch is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Supply-Chain & Operational Security

> [!IMPORTANT]
> **Dependency Pinning Policy**  
> To protect against supply-chain attacks (e.g., Miasma / TeamPCP patterns), Groza requires strict dependency pinning in `package-lock.json`. We do not blindly auto-merge `dependabot` PRs for core geospatial (`@turf/turf`) or message queue (`bullmq`) dependencies without manual QA validation.

- **Agent Isolation:** We utilize `.github/copilot-code-review.yml` (or equivalent policies) with `excludeAgent` where applicable to ensure AI tools do not automatically push unverified code to production branches.
- **Zero-Trust Boot:** The application boot sequence enforces a strict health-check (Database, Redis, BullMQ). If critical infrastructure is unreachable, the app halts or enters a Degraded state safely rather than leaking partial data.

## Reporting a Vulnerability

Please do not open a public issue for security vulnerabilities. 
If you discover a potential vulnerability, please report it privately to the maintainers. We prioritize issues related to:
- Telemetry spoofing or injection
- Credential leaks or bypasses in the admin dashboard
- Denial of Service (DoS) vectors against the Lightning Listener

We will acknowledge reports within 48 hours.
