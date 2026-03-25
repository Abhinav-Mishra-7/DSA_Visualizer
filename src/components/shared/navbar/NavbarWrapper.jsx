import Navbar from '../components/shared/Navbar';

export default function NavbarWrapper({ translate }) {
  return (
    <div
      style={{
        transform: `translateY(${translate}px)`,
        transition: 'transform 0.1s linear',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50
      }}
    >
      <Navbar />
    </div>
  );
}