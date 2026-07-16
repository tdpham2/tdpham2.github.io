#!/usr/bin/env bash
set -euo pipefail

tmp_dir="$(mktemp -d)"
tmp_site="${tmp_dir}/site"

cleanup() {
  rm -rf "${tmp_dir}"
}
trap cleanup EXIT

bundle exec jekyll build -d "${tmp_site}" >/dev/null

for asset in \
  assets/js/distillpub/template.v2.js \
  assets/js/distillpub/transforms.v2.js \
  assets/js/distillpub/overrides.js; do
  if [ ! -f "${tmp_site}/${asset}" ]; then
    echo "distill runtime asset was not generated: ${asset}" >&2
    exit 1
  fi
done

transforms_runtime="${tmp_site}/assets/js/distillpub/transforms.v2.js"
distill_runtime="$(bundle exec ruby -e 'spec = Gem.loaded_specs["al_folio_distill"]; puts(spec ? File.join(spec.full_gem_path, "assets/js/distillpub/transforms.v2.js") : "")')"
if [ -f "${distill_runtime}" ]; then
  transforms_runtime="${distill_runtime}"
fi

expected_transforms_hash="70e3f488e23ec379d33a10a60311ec60b570b3b2d5f1823e9159f661c315184e"
actual_transforms_hash="$(ruby -rdigest -e 'print Digest::SHA256.file(ARGV[0]).hexdigest' "${transforms_runtime}")"
if [ "${actual_transforms_hash}" != "${expected_transforms_hash}" ]; then
  echo "unexpected distill transforms runtime hash: ${actual_transforms_hash}" >&2
  exit 1
fi

echo "distill integration checks passed"
