import {
  useLoaderData,
  useNavigation,
  Form,
  useActionData,
  redirect,
  useNavigate,
} from "react-router-dom";
import { loginUser } from "../api";
import { getUserFromStorage } from "../utils";
import { useAuth } from "../contexts/AuthContexts";

export async function loader({ request }) {
  const user = getUserFromStorage();
  const searchParams = new URL(request.url).searchParams;
  const redirectTo = searchParams.get("redirectTo") || "/host";
  if (user && user.id) return redirect(redirectTo, { replace: true });
  const message = searchParams.get("message");
  return { message };
}

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    // we can set the token in the cookies as well
    const { user } = await loginUser({ email, password });
    const searchParams = new URL(request.url).searchParams;
    const redirectTo = searchParams.get("redirectTo") || "/host";
    return { redirectTo, user };
  } catch (err) {
    return err;
  }
}

export default function Login() {
  const data = useActionData();
  const { message } = useLoaderData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { login } = useAuth();

  if (data?.user) {
    login(data);
    navigate(data.redirectTo);
  }

  return (
    <div className="login-container">
      <h1>Sign in to your account</h1>
      {message && <h3 className="red">{message}</h3>}
      {data?.message && <h3 className="red">{data.message}</h3>}

      <Form method="post" className="login-form" replace>
        <input
          name="email"
          type="email"
          placeholder="Email address"
          autoComplete="email"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
        />
        <button disabled={navigation.state === "submitting"}>
          {navigation.state === "submitting" ? "Logging in..." : "Log in"}
        </button>
      </Form>
      <p>
        <span>
          You can use email: b@b.com and password: p123 for demo purposes
        </span>
      </p>
    </div>
  );
}
