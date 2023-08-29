# Step

- 1 build sixnft datachain
- 2 delete index.ts ./sixnft/sixnft.{module}/index.ts
- 3 search all remove

```typescript
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
```

- 4 export SignAndBroadcastOptions in all sixnft/{module name}/module/index
export interface SignAndBroadcastOptions

- 5 change from

```typescript
interface SignAndBroadcastOptions {
  fee: StdFee,
  memo?: string
}
```

to

```typescript
export interface SignAndBroadcastOptions {
  fee: StdFee | "auto",
  memo?: string
}
```

- 6 import {... ,SigningStargateClientOptions} from @cosmjs/stargate
modify txClientOptions
const txClient = async (wallet: OfflineSigner, { addr: addr }: TxClientOptions = { addr: "http://localhost:26657" }, options?: SigningStargateClientOptions) => {

From

```typescript
import { SigningStargateClient } from "@cosmjs/stargate";
```

```typescript
const txClient = async (wallet: OfflineSigner, { addr: addr }: TxClientOptions = { addr: "http://localhost:26657" }) => {
```

To

```typescript
import { SigningStargateClient, SigningStargateClientOptions} from "@cosmjs/stargate";
```

```typescript
const txClient = async (wallet: OfflineSigner, { addr: addr }: TxClientOptions = { addr: "http://localhost:26657" }, options?: SigningStargateClientOptions) => {
```


- 7 modify SigningStargateClient

from

```typescript
client = await SigningStargateClient.connectWithSigner(addr, wallet, { registry });
```

To

```typescript
client = await SigningStargateClient.connectWithSigner(addr, wallet, { registry , ...options});
```
