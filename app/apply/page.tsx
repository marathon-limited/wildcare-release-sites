import ApplyForm from './ApplyForm';

export default function ApplyPage() {
  return (
    <div className="wrap" style={{ maxWidth: 800 }}>
      <h1>Release Site Application</h1>
      <p className="sub">
        For landholders offering their property as a release site for rehabilitated wildlife.
        Wildcare membership is not required.
      </p>
      <ApplyForm />
    </div>
  );
}
