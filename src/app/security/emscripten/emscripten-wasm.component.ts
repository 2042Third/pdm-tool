import { AfterViewInit, OnInit, Directive } from "@angular/core";
import { loadScript } from "./tools";
import { environment } from "../../../environments/environment";
import wasmCacheBusting from "../../../wasm-cache-busting.json";

type EmscriptenModuleDecorator<M extends EmscriptenModule> = (module: M) => void;

const noopModuleDecorator = (mod: EmscriptenModule) => mod;

@Directive()
export abstract class EmscriptenWasmComponent<M extends EmscriptenModule = EmscriptenModule> implements AfterViewInit {
  private resolvedModule!: M;
  protected moduleDecorator!: EmscriptenModuleDecorator<M>;

  protected constructor(private moduleExportName: string, private wasmJavaScriptLoader: string) {}

  get module(): M {
    return this.resolvedModule;
  }

  ngAfterViewInit(): void {
    // console.log("before loading");
    this.resolveModule();
  }

  protected resolveModule(): void {
    const jsVersion = wasmCacheBusting[this.wasmJavaScriptLoader]
      ? `?v=${wasmCacheBusting[this.wasmJavaScriptLoader]}`
      : "";
    // console.log("Trying to load cc20..."+`${environment.wasmAssetsPath}/${this.wasmJavaScriptLoader}${jsVersion}`);
    loadScript(this.moduleExportName, `${environment.wasmAssetsPath}/${this.wasmJavaScriptLoader}${jsVersion}`)
      .then(() => {
        const module = <M>{
          locateFile: (file: string) => {
            const fileVersion = wasmCacheBusting[file] ? `?v=${wasmCacheBusting[file]}` : "";
            return `${environment.wasmAssetsPath}/${file}${fileVersion}`;
          },
        };
        // console.log("loaded...");
        const moduleDecorator: EmscriptenModuleDecorator<M> = this.moduleDecorator || noopModuleDecorator;
        moduleDecorator(module);

        return window[this.moduleExportName](module);
      })
      .then((mod) => {
        this.resolvedModule = mod;
      });
  }
}
