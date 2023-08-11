import CenteredContainer from '../components/CenteredContainer';
import { ConnectButton } from '../components/ConnectButton';
import { Ethscribe } from '../components/Ethscribe';
import { GithubButton } from '../components/GithubButton';

function Home() {
  return (
    <>
      <div style={{ position: 'fixed', top: 10, left: 10 }}>
        <GithubButton />
      </div>
      <div style={{ position: 'fixed', top: 10, right: 10 }}>
        <ConnectButton />
      </div>
      <CenteredContainer>
        <h2 style={{ fontFamily: '"Inter", sans-serif', fontWeight: "900", fontSize: 36 }}>Secret Scribe</h2>
        <div
          style={{
            fontFamily: '"Inter", sans-serif',
            marginBottom: 25,
            width: "450px",
            maxWidth: "90vw",
            lineHeight: 1.25,
          }}
        >
          This is a simple tool by <a href="https://twitter.com/dumbnamenumbers">Middlemarch</a> to ethscribe secret messages {' '}
          <a href="https://twitter.com/zac_denham">based on work by zacque.eth</a>.</div>
          
          <div
            style={{
              fontFamily: '"Inter", sans-serif',
              marginBottom: 25,
              width: "450px",
              maxWidth: "90vw",
              lineHeight: 1.25,
            }}
          
          > Enter a secret message and password and click &quot;Ethscribe.&quot; The resulting ethscription will be a self-contained HTML page containing the encrypted message, decryption logic, and a field to enter the password to automatically decrypt the message. You will get a preview as you type and can try entering your password yourself to see if it works.
        </div>
        <Ethscribe />
      </CenteredContainer>
    </>
  );
}

export default Home;
