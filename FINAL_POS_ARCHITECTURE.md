# FINAL JointVibe POS Architecture

This branch `pos_master` contains the unified Hybrid POS (Nocturne UI + legacy logic).
References:
- POS structure (PDF): /mnt/data/POS 1 Structure.pdf
- Sphere view (PDF): /mnt/data/sphere view.pdf

High level:
- POSProvider: src/frontend/contexts/POSProvider.jsx
- Global POS entry: /venue/pos -> src/frontend/pages/POS/POSLayout.jsx
- Manager activation: /venue/pos/auth/manager -> POSAuthManager.jsx
- Placeholders: src/frontend/pages/POS/components/*

Next steps:
1. Replace placeholders with full UI from /src/frontend/pages/POS/NocturnePOS or legacy components.
2. Implement backend invite/accept flows and notifications.
3. Implement AI waiter endpoint and Sphere ↔ POS realtime bridge (socket.io).
